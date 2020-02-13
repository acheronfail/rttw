import log from '../logger';
import { Store } from '../store';
import ServerError, { isServerError } from '../errors';
import { ObjectId } from 'mongodb';
import { VIEWABLE_PUZZLE_COUNT } from '../types';
import { getSolvedPuzzleCount } from '../utils';

export const apiSubmit = (store: Store) => async (req, res) => {
  const { id, name, solution } = req.body;
  log.api('/api/submit', `id: "${id}"`, `name: "${name}"`, `solution: "${solution}"`);

  let nAvailable = VIEWABLE_PUZZLE_COUNT;
  let userId = id;
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
  // TODO: verify solution by running in VM (what about solutions that require custom browsers?)
  try {
    const puzzle = await store.getPuzzle(name);
    if (puzzle.index < nAvailable) {
      // Update solution in db
      const id = new ObjectId(userId);
      await store.updateUserSolution(id, name, solution);
      // Send back refreshed user data
      res.json({ result: await store.getUser(id) });
    }
  } catch (err) {
    log.error(err);
    res.status(500).send('KO');
  }
};
