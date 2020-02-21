import {
  ApiSubmitResponse,
  ApiSubmitRouteOptions,
  Puzzle,
  constants,
  evalTemplate,
  getSolvedPuzzleCount,
  schemas,
} from '@rttw/common';
import { firefox } from 'playwright';

// TODO: create concept of "services" to hold business logic (and instantiate dependencies).
const browser = firefox.launch({ headless: true });

async function validateSolution(puzzle: Puzzle, userInput: string): Promise<boolean> {
  const context = await (await browser).newContext();
  const webpage = await context.newPage();
  const result = await webpage.evaluate(evalTemplate(puzzle, userInput));
  if (result !== true) {
    throw new Error(`Returned value was: ${result}`);
  }

  return true;
}

export const apiSubmitRoute: ApiSubmitRouteOptions = {
  method: 'POST',
  url: '/api/submit',
  schema: schemas.routes.apiSubmit,
  handler: async function(request, reply): Promise<ApiSubmitResponse> {
    const { id, name, solution } = request.body;

    const user = await this.store.getOrAddUser(id);
    const limit = constants.VIEWABLE_PUZZLE_COUNT + getSolvedPuzzleCount(user);

    // Disallow submission if user doesn't have access to the puzzle,
    const puzzle = await this.store.getPuzzle(name);
    if (puzzle.index >= limit) {
      reply.code(403);
      throw new Error('Attempted to solve a puzzle without access');
    }

    const isSolutionValid = await validateSolution(puzzle, solution).catch(err => {
      this.log.info({ err });
      return false;
    });

    if (!isSolutionValid) {
      reply.code(403);
      throw new Error(`Solution failed for puzzle: ${name}`);
    }

    // Update solution in db
    await this.store.updateUserSolution(user._id.toHexString(), name, solution);

    // Send back refreshed user data
    const latestUser = await this.store.getUser(user._id.toHexString());
    return { user: latestUser };
  },
};
