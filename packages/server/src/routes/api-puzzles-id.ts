import { ApiGetPuzzlesResponse, BLANK_USER, VIEWABLE_PUZZLE_COUNT } from '@rttw/common';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import StoreError, { isStoreError } from '../errors';
import log from '../logger';
import { Store } from '../store';
import { getSolvedPuzzleCount } from '../utils';

export const apiPuzzlesId = (store: Store) => async (req: Request, res: Response) => {
  const { id } = req.params;
  log.api('/api/puzzles/:id?', `id: "${id}"`);

  // Fetch the user and determine how many puzzles are available to them
  const user = await store.getUser(new ObjectId(id)).catch(err => {
    if (isStoreError(err) && err.code === StoreError.ENOENT) {
      return BLANK_USER;
    }

    throw err;
  });

  const limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);
  const puzzles = await store.getPuzzles(limit);
  const data: ApiGetPuzzlesResponse = { puzzles, user };
  res.json(data);
};
