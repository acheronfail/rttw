import { APIGatewayEvent, Handler } from 'aws-lambda';
import { ApiPuzzlesResponse } from '@rttw/common';

const handler: Handler<APIGatewayEvent, ApiPuzzlesResponse> = (_event, _context, callback) => {
  callback(undefined, {
    puzzles: [
      {
        index: 0,
        name: 'id',
        source: 'function id(x) { return x; }',
      },
      {
        index: 0,
        name: 'reflexive',
        source: 'function reflexive(x) { return x != x; }',
      },
      {
        index: 0,
        name: 'transitive',
        source: 'function transitive(x, y, z) { return x && x == y && y == z && z != x; }',
      },
    ],
    user: {
      solutions: {},
    },
  });
};

export { handler };
