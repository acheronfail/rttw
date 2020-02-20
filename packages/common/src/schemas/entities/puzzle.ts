import { JSONSchema } from 'json-schema-to-typescript';

export const puzzle: JSONSchema = {
  type: 'object',
  required: ['index', 'name', 'source'],
  additionalProperties: false,
  properties: {
    index: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
  },
};
