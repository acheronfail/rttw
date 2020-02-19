import { Puzzle } from './types';

// TODO: protect against the user modifying the function.
export function evalTemplate(puzzle: Puzzle, userInput: string) {
  return `(function () {

// The source of the puzzle.
${puzzle.source};

// Make the puzzle available globally.
window['${puzzle.name}'] = ${puzzle.name};

// Verify user input if it has been defined.
if (window.verifyInput) {
  window.verifyInput(${JSON.stringify(userInput)});
}

})();

// Run function with the user's input.
${puzzle.name}(${userInput});
`;
}
