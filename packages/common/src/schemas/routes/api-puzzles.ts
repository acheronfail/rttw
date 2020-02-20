import { RouteSchema } from 'fastify';
import { user } from '../entities/user';
import { puzzle } from '../entities/puzzle';

export const apiPuzzles: RouteSchema = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {},
  headers: {},
  params: {},
  response: {
    200: {
      type: 'object',
      required: ['user', 'puzzles'],
      additionalProperties: false,
      properties: {
        user,
        puzzles: {
          type: 'array',
          items: puzzle,
        },
      },
    },
  },
};
