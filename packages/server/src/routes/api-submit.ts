import { ApiPostSubmitRequest, ApiPostSubmitResponse, VIEWABLE_PUZZLE_COUNT } from '@rttw/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import log from '../logger';
import { Store } from '../store';
import { getSolvedPuzzleCount } from '../utils';

export const apiSubmit = (store: Store) => async (req: Request, res: Response) => {
  // TODO: validate incoming requests
  const { id, name, solution } = req.body as ApiPostSubmitRequest;

  // TODO: logging middleware
  log.api('/api/submit', `id: "${id}"`, `name: "${name}"`, `solution: "${solution}"`);

  const user = await store.getOrAddUser(new ObjectId(id));
  const limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);

  // TODO: verify solution by running in VM/headless instance (required browser)
  const isSolutionValid = true;
  if (!isSolutionValid) {
    return res.status(403).send();
  }

  // Disallow submission if user doesn't have access to the puzzle,
  const puzzle = await store.getPuzzle(name);
  if (puzzle.index < limit) {
    // Update solution in db
    await store.updateUserSolution(user._id, name, solution);
    // Send back refreshed user data
    const latestUser = await store.getUser(user._id);
    const data: ApiPostSubmitResponse = { user: latestUser };
    res.json(data);
  }
};
