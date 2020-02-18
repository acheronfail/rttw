import { Puzzle } from '@rttw/common';
import { Editor, TextMarkerOptions, TextMarker, EditorChange } from 'codemirror';
import { TestResult } from './eval';

export const EVAL_WAIT_TIME = 300;
const READ_ONLY_CSS = 'font-style: italic;';
const TITLE_MARKER_BEFORE = 'before';
const TITLE_MARKER_AFTER = 'after';
const TITLE_MARKER_EDITABLE = 'editable';
const EMPTY_TEST_RESULT: TestResult = {
  shouldUpdateSolution: false,
  name: '',
  solution: '',
  error: '<no input>',
};
const MARKER_BEFORE_OPTIONS = {
  inclusiveLeft: true,
  readOnly: true,
  atomic: true,
  title: TITLE_MARKER_BEFORE,
  css: READ_ONLY_CSS,
};
const MARKER_AFTER_OPTIONS = {
  inclusiveRight: true,
  readOnly: true,
  atomic: true,
  title: TITLE_MARKER_AFTER,
  css: READ_ONLY_CSS,
};
const MARKER_EDITABLE_OPTIONS = {
  clearWhenEmpty: false,
  readOnly: false,
  title: TITLE_MARKER_EDITABLE,
  css: 'font-weight: bold;',
};

const firstPos = (_cm: Editor) => ({ line: 0, ch: 0 });

const lastPos = (cm: Editor) => {
  const line = cm.lastLine();
  const ch = cm.getLine(line).length;
  return { line, ch };
};

// The text before the editable region.
const beforeMarkerText = (puzzle: Puzzle) => `// This is your function...
${puzzle.source}

// ... now make it return \`true\`!
${puzzle.name}(`;

// The text after the editable region.
const afterMarkerText = (result: TestResult) => `);

// Result: ${result.result}
// Length: ${result.solution.length}
`;

// FIXME: the marker type is incorrect, fix upstream
function findMarker(cm: Editor, title: string): TextMarkerOptions & TextMarker {
  for (const mark of cm.getAllMarks()) {
    if ((mark as TextMarkerOptions & TextMarker).title === title) {
      return mark;
    }
  }

  throw new Error(`Failed to find marker with title: ${title}`);
}

export function getUserInput(cm: Editor) {
  const mark = findMarker(cm, TITLE_MARKER_EDITABLE);
  const { from, to } = mark.find();
  return cm.getRange(from, to).trim();
}

export interface RenderPuzzleIntoCodeMirrorOptions {
  cm: Editor;
  puzzle: Puzzle;
  previousSolution?: string;
  onChanges: (cm: Editor, changes: EditorChange[]) => void;
}

export function updateResultInCodeMirror(cm: Editor, result: TestResult) {
  // Since the marker is readonly, we first need to remove it and reset it.
  const marker = findMarker(cm, TITLE_MARKER_AFTER);
  const range = marker.find();
  // Remove the marker.
  marker.clear();
  // Replace text _inside_ the range with new text.
  cm.replaceRange(afterMarkerText(result), { line: range.from.line, ch: range.from.ch + 1 }, range.to);
  // Re-mark the text as readonly.
  cm.markText(range.from, lastPos(cm), MARKER_AFTER_OPTIONS);
}

export function renderPuzzleIntoCodeMirror(options: RenderPuzzleIntoCodeMirrorOptions) {
  const { cm, puzzle, previousSolution = '', onChanges } = options;

  // NOTE: There must be a space on each side for the read only markers.
  const editableText = ` ${previousSolution} `;
  const before = beforeMarkerText(puzzle);
  const after = afterMarkerText(
    previousSolution
      ? { name: puzzle.name, shouldUpdateSolution: false, solution: previousSolution, result: 'true' }
      : EMPTY_TEST_RESULT,
  );
  cm.setValue(before + editableText + after);

  // Calculate the start and end points of the editable region.
  const userInputStart = before.length;
  const userInputEnd = userInputStart + editableText.length;

  // Create marks to separate ranges of the editor.
  cm.markText(firstPos(cm), cm.posFromIndex(userInputStart + 1), MARKER_BEFORE_OPTIONS);
  cm.markText(cm.posFromIndex(userInputStart), cm.posFromIndex(userInputEnd), MARKER_EDITABLE_OPTIONS);
  cm.markText(cm.posFromIndex(userInputEnd - 1), lastPos(cm), MARKER_AFTER_OPTIONS);

  // Prepare editor.
  cm.execCommand('selectAll');
  setTimeout(() => cm.refresh(), 0);

  cm.on('changes', onChanges);
}
