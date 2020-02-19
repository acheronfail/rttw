import { ApiGetPuzzlesResponse, BLANK_USER, VIEWABLE_PUZZLE_COUNT } from '@rttw/common';
import { ObjectId } from 'mongodb';
import fastify from 'fastify';
import StoreError, { isStoreError } from '../errors';
import { getSolvedPuzzleCount } from '../utils';

export const apiPuzzlesRoute: fastify.RouteOptions = {
  method: 'GET',
  url: '/api/puzzles',
  schema: {
    querystring: {
      id: {
        type: 'string',
      },
    },
    // TODO: create and convert JSON schema to a TS type to have one source of truth
    // response: {}
  },
  handler: async function(request, _reply): Promise<ApiGetPuzzlesResponse> {
    const { id } = request.query;

    // Fetch the user and determine how many puzzles are available to them
    const user = await this.store.getUser(new ObjectId(id)).catch(err => {
      if (isStoreError(err) && err.code === StoreError.ENOENT) {
        return BLANK_USER;
      }

      throw err;
    });

    const limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);
    const puzzles = await this.store.getPuzzles(limit);

    return { puzzles, user };
  },
};
