import { APIGatewayEvent, Handler } from 'aws-lambda';
import { ApiSubmitResponse, Puzzle, evalTemplate } from '@rttw/common';
import { firefox } from 'playwright';

async function validateSolution(puzzle: Puzzle, userInput: string): Promise<boolean> {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const webpage = await context.newPage();
  const result = await webpage.evaluate(evalTemplate(puzzle, userInput));
  if (result !== true) {
    throw new Error(`Returned value was: ${result}`);
  }

  return true;
}

const handler: Handler<APIGatewayEvent, ApiSubmitResponse> = async (event, _context) => {
  const { solution = '' } = JSON.parse(event.body || '{}');

  const puzzle = {
    index: 0,
    name: 'id',
    source: 'function id(x) { return x; }',
  };

  const isSolutionValid = await validateSolution(puzzle, solution).catch(err => {
    console.log({ err });
    return false;
  });

  return {
    user: {
      solutions: {
        ...(isSolutionValid ? { id: solution } : {}),
      },
    },
  };
};

export { handler };
