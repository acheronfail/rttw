import { RouteSchema } from 'fastify';
import { user } from '../entities/user';

export const apiSubmit: RouteSchema = {
  body: {
    type: 'object',
    required: ['name', 'solution'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      solution: {
        type: 'string',
      },
    },
  },
  querystring: {},
  headers: {},
  params: {},
  response: {
    200: {
      type: 'object',
      required: ['user'],
      additionalProperties: false,
      properties: {
        user,
      },
    },
  },
};
