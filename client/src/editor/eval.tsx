import { Editor } from 'codemirror';
import { Puzzle } from '../store/reducer';
import { getUserInput } from './utils';

export interface TestResult {
  // Should we send a request to the server to update the solution?
  shouldUpdateSolution: boolean;
  // The name of the puzzle tested.
  name: string;
  // The user's solution.
  solution: string;
  // The actual result from the function (if it didn't throw).
  result?: string;
  // An error message (if any).
  error?: string;
}

function runInIframe(puzzle: Puzzle, userInput: string) {
  // Run code in a "semi"-sandboxed env via iframe - the user can still hang the app with
  // infinite loops and such, but this means breaking the current page is a little less likely
  const iframe = document.createElement('iframe');

  // TODO: sandbox iframe but still allow eval (may have to use postMessage)
  // iframe.setAttribute('sandbox', 'allow-scripts');
  document.body.appendChild(iframe);

  try {
    const javascript = `(function () {

${puzzle.source};

  window['${puzzle.name}'] = ${puzzle.name};
})();

    ${puzzle.name}(${userInput})
    `;

    // TODO: for some reason the `eval()` type doesn't exist in TypeScript?
    const result = (iframe.contentWindow as any)?.eval(javascript);
    return {
      didError: false,
      result: JSON.stringify(result),
    };
  } catch (err) {
    return {
      didError: true,
      result: err?.message || err,
    };
  } finally {
    // Remove the iframe from the DOM since we don't need it anymore
    iframe.remove();
  }
}

export function testInIframe(cm: Editor, puzzle: Puzzle, previousSolution?: string): TestResult {
  const userInput = getUserInput(cm);
  const { didError, result } = runInIframe(puzzle, userInput);
  const didPassTest = !didError && result === 'true';

  const testResult = {
    name: puzzle.name,
    shouldUpdateSolution: didPassTest && (!previousSolution || userInput.length < previousSolution.length),
    solution: userInput,
    result: didError ? `${result} <errored>` : result,
  };

  return testResult;
}
