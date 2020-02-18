import { VIEWABLE_PUZZLE_COUNT, ApiPostSubmitResponse, ApiPostSubmitRequest } from '@rttw/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ServerError, { isServerError } from '../errors';
import log from '../logger';
import { Store } from '../store';
import { getSolvedPuzzleCount } from '../utils';

export const apiSubmit = (store: Store) => async (req: Request, res: Response) => {
  // TODO: validate incoming requests
  const { id, name, solution } = req.body as ApiPostSubmitRequest;
  log.api('/api/submit', `id: "${id}"`, `name: "${name}"`, `solution: "${solution}"`);

  let nAvailable = VIEWABLE_PUZZLE_COUNT;
  let userId = new ObjectId(id);
  try {
    const user = await store.getUser(userId);
    nAvailable = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);
  } catch (err) {
    // Create a new user if no user was found by that id
    if (isServerError(err) && err.code == ServerError.ENOENT) {
      try {
        const { insertedId } = await store.addUser();
        userId = insertedId;
      } catch (err) {
        log.error(err);
        return res.status(500).send('KO');
      }
    } else {
      log.error(err);
      return res.status(500).send('KO');
    }
  }

  // Disallow submission if user doesn't have access to the puzzle,
  // TODO: verify solution by running in VM/headless instance (required browser)
  try {
    const puzzle = await store.getPuzzle(name);
    if (puzzle.index < nAvailable) {
      // Update solution in db
      const id = new ObjectId(userId);
      await store.updateUserSolution(id, name, solution);
      // Send back refreshed user data
      const data: ApiPostSubmitResponse = { user: await store.getUser(id) };
      res.json(data);
    }
  } catch (err) {
    log.error(err);
    res.status(500).send('KO');
  }
};
