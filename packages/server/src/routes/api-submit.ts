import { ApiPostSubmitResponse, Puzzle, VIEWABLE_PUZZLE_COUNT, evalTemplate } from '@rttw/common';
import { ObjectId } from 'mongodb';
import { firefox } from 'playwright';
import fastify from 'fastify';
import { getSolvedPuzzleCount } from '../utils';

// TODO: create concept of "services" to hold business logic (and instantiate dependencies).
const browser = firefox.launch({ headless: true });

// TODO: handle errors (use TestResult here too)
async function validateSolution(puzzle: Puzzle, userInput: string): Promise<boolean> {
  const context = await (await browser).newContext();
  const webpage = await context.newPage();
  const result = await webpage.evaluate(evalTemplate(puzzle, userInput));
  return result === true;
}

export const apiSubmitRoute: fastify.RouteOptions = {
  method: 'POST',
  url: '/api/submit',
  schema: {
    // TODO: convert JSON schema to a TS type to have one source of truth
    body: {
      type: 'object',
      required: ['name', 'solution'],
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
  },
  handler: async function(request, reply): Promise<ApiPostSubmitResponse> {
    const { id, name, solution } = request.body;

    const user = await this.store.getOrAddUser(new ObjectId(id || undefined));
    const limit = VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);

    // Disallow submission if user doesn't have access to the puzzle,
    const puzzle = await this.store.getPuzzle(name);
    if (puzzle.index >= limit) {
      reply.code(403);
      throw new Error('User attempted to solve a puzzle without access');
    }

    const isSolutionValid = await validateSolution(puzzle, solution);
    if (!isSolutionValid) {
      reply.code(403);
      throw new Error(`User solution failed: ${name} ${solution}`);
    }

    // Update solution in db
    await this.store.updateUserSolution(user._id, name, solution);
    // Send back refreshed user data
    const latestUser = await this.store.getUser(user._id);
    return { user: latestUser };
  },
};
