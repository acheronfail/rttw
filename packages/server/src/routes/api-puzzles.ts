import { ApiPuzzlesResponse, ApiPuzzlesRouteOptions, constants, getSolvedPuzzleCount, schemas } from '@rttw/common';
import StoreError, { isStoreError } from '../errors';

export const apiPuzzlesRoute: ApiPuzzlesRouteOptions = {
  method: 'GET',
  url: '/api/puzzles',
  schema: schemas.routes.apiPuzzles,
  handler: async function(request, _reply): Promise<ApiPuzzlesResponse> {
    const { id } = request.query;

    // Fetch the user and determine how many puzzles are available to them
    const user = await this.store.getUser(id).catch(err => {
      if (isStoreError(err) && err.code === StoreError.ENOENT) {
        return constants.BLANK_USER;
      }

      throw err;
    });

    const limit = constants.VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);
    const puzzles = await this.store.getPuzzles(limit);

    return { puzzles, user };
  },
};
