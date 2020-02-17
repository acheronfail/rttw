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
  // Was the test successful?
  passed: boolean;
  // An error message (if any).
  error?: string;
}

export function testLocal(cm: Editor, puzzle: Puzzle, previousSolution?: string): TestResult {
  // Run code in a "semi"-sandboxed env via iframe - the user can still hang the app with
  // infinite loops and such, but this means breaking the current page is a little less likely
  const iframe = document.createElement('iframe');
  // TODO: sandbox iframe but still allow eval (may have to use postMessage)
  // iframe.setAttribute('sandbox', 'allow-scripts');
  document.body.appendChild(iframe);

  const userInput = getUserInput(cm);
  try {
    const javascript = `(function () {
      ${puzzle.source};
      window['${puzzle.name}'] = ${puzzle.name};
    })();

    ${puzzle.name}(${userInput})
    `;

    // TODO: for some reason the `eval()` type doesn't exist in TypeScript?
    const jsResult = JSON.stringify((iframe.contentWindow as any)?.eval(javascript));
    const passed = jsResult === 'true';

    // Update the user's solution if it was shorter than the previous.
    const shouldUpdateSolution = passed && (!previousSolution || userInput.length < previousSolution.length);

    return {
      name: puzzle.name,
      shouldUpdateSolution,
      solution: userInput,
      passed,
    };
  } catch (err) {
    return {
      name: puzzle.name,
      shouldUpdateSolution: false,
      solution: userInput,
      passed: false,
      error: err.message,
    };
  } finally {
    // Remove the iframe from the DOM since we don't need it anymore
    iframe.remove();
  }
}
