import { ApiPostSubmitRequest, ApiPostSubmitResponse, Puzzle, VIEWABLE_PUZZLE_COUNT, evalTemplate } from '@rttw/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { firefox } from 'playwright';
import log from '../logger';
import { Store } from '../store';
import { getSolvedPuzzleCount } from '../utils';

// TODO: create concept of "services" to hold business logic (and instantiate dependencies).
const browser = firefox.launch({ headless: true });

// TODO: handle errors (use TestResult here too)
async function validateSolution(puzzle: Puzzle, userInput: string): Promise<boolean> {
  const context = await (await browser).newContext();
  const webpage = await context.newPage();
  const result = await webpage.evaluate(evalTemplate(puzzle, userInput));
  return result === true;
}

export const apiSubmit = (store: Store) => async (req: Request, res: Response) => {
  // TODO: validate incoming requests
  const { id, name, solution } = req.body as ApiPostSubmitRequest;

  // TODO: logging middleware
  log.api('/api/submit', `id: "${id}"`, `name: "${name}"`, `solution: "${solution}"`);

  const user = await store.getOrAddUser(new ObjectId(id));
  const limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);

  // Disallow submission if user doesn't have access to the puzzle,
  const puzzle = await store.getPuzzle(name);
  if (puzzle.index >= limit) {
    log.error(new Error('User attempted to solve a puzzle without access'));
    return res.status(403).send();
  }

  const isSolutionValid = await validateSolution(puzzle, solution);
  if (!isSolutionValid) {
    log.error(new Error(`User solution failed: ${name} ${solution}`));
    return res.status(403).send();
  }

  // Update solution in db
  await store.updateUserSolution(user._id, name, solution);
  // Send back refreshed user data
  const latestUser = await store.getUser(user._id);
  const data: ApiPostSubmitResponse = { user: latestUser };
  res.json(data);
};
