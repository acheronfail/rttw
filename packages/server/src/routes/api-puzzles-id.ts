import { ApiGetPuzzlesResponse, BLANK_USER, VIEWABLE_PUZZLE_COUNT } from '@rttw/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import ServerError, { isServerError } from '../errors';
import log from '../logger';
import { Store } from '../store';
import { getSolvedPuzzleCount } from '../utils';

export const apiPuzzlesId = (store: Store) => async (req: Request, res: Response) => {
  const { id } = req.params;
  log.api('/api/puzzles/:id?', `id: "${id}"`);

  // Fetch the user and determine how many puzzles are available to them
  let limit, user;
  try {
    user = await store.getUser(new ObjectId(id));
    limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);
  } catch (err) {
    // If there was no user, then just return a default
    if (isServerError(err) && err.code == ServerError.ENOENT) {
      user = BLANK_USER;
      limit = VIEWABLE_PUZZLE_COUNT;
    } else {
      log.error(err);
      return res.status(500).send('KO');
    }
  }

  // Find and return a sorted list of puzzle available to the user
  const puzzles = await store.getPuzzles(limit);
  const data: ApiGetPuzzlesResponse = { puzzles, user };
  res.json(data);
};
