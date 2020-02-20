import { JSONSchema } from 'json-schema-to-typescript';

export const user: JSONSchema = {
  type: 'object',
  required: ['solutions'],
  additionalProperties: false,
  properties: {
    _id: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
    solutions: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
  },
};
