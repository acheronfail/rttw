import { JSONSchema } from 'json-schema-to-typescript';

// TODO: move leaderboard into the puzzle doc itself

export const leaderboardEntry: JSONSchema = {
  type: 'object',
  required: ['username', 'length', 'date'],
  additionalProperties: false,
  properties: {
    username: {
      type: 'string',
    },
    length: {
      type: 'number',
    },
    date: {
      type: 'string',
      format: 'date',
    },
  },
};

export const leaderboard: JSONSchema = {
  type: 'object',
  required: ['name', 'scores'],
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
    scores: {
      type: 'array',
      items: leaderboardEntry,
    },
  },
};
