import CodeMirror from 'codemirror';
import { debounce } from 'debounce';
import { Box, Select, Text } from 'grommet';
import React, { useRef, useEffect } from 'react';
import { submitSolution } from '../api';
import { getColor } from '../app/themes';
import { useStoreContext } from '../store';
import { setEditorConfigAction } from '../store/actions';
import { testInIframe } from './eval';
import { keyMaps } from './key-map';
import { themes } from './theme';
import { renderPuzzleIntoCodeMirror, EVAL_WAIT_TIME, updateResultInCodeMirror } from './utils';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

export interface EditorBarProps {
  theme?: string;
  keyMap?: string;
}

function EditorBar({ theme, keyMap }: EditorBarProps) {
  const { state, dispatch } = useStoreContext();
  const { darkMode } = state.client;

  return (
    <Box
      tag="header"
      direction="row"
      pad="small"
      align="center"
      justify="end"
      border="bottom"
      background={getColor(darkMode, 'background')}
    >
      <Text margin={{ horizontal: 'small' }}>Key Map:</Text>
      <Select
        options={keyMaps}
        value={keyMap}
        onChange={({ option }) => dispatch(setEditorConfigAction({ keyMap: option }))}
      />
      <Text margin={{ horizontal: 'small' }}>Theme:</Text>
      <Select
        options={themes}
        value={theme}
        onChange={({ option }) => dispatch(setEditorConfigAction({ theme: option }))}
      />
    </Box>
  );
}

export function Editor() {
  const { state, dispatch } = useStoreContext();
  const { codemirror, showSidebar, selectedPuzzleIndex, solvedModal } = state.client;
  const { puzzles, user } = state.server;

  const puzzle = puzzles[selectedPuzzleIndex];
  const previousSolution = user.solutions[puzzle?.name];

  // Instantiate CodeMirror.
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cmRef = useRef<CodeMirror.EditorFromTextArea | null>(null);
  useEffect(() => {
    // We know that the ref is not null here since `useEffect` runs after render.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cmRef.current = CodeMirror.fromTextArea(textareaRef.current!, codemirror);

    return () => {
      cmRef.current?.toTextArea();
    };
  }, [codemirror]);

  // Effect to ensure CodeMirror is focused and refreshed correctly.
  useEffect(() => {
    // Focus the editor when the puzzles change (or when a modal closes).
    if (!solvedModal.show) {
      setTimeout(() => {
        cmRef.current?.refresh();
        cmRef.current?.focus();
      }, 0);
    }
  }, [solvedModal.show, showSidebar]);

  // Update CodeMirror with the current puzzle.
  useEffect(() => {
    let onChanges: (cm: CodeMirror.Editor, changes?: CodeMirror.EditorChange[]) => void;
    const cm = cmRef.current;
    if (cm && puzzle) {
      onChanges = debounce((_, changes) => {
        // NOTE: from local testing it _seems_ if we change the editor programmatically
        // then we'll receive `undefined` for the changes parameter. In this case
        // we shouldn't try to run any tests since that's us changing the editor,
        // not the user.
        if (changes?.length) {
          const result = testInIframe(cm, puzzle, previousSolution);
          updateResultInCodeMirror(cm, result);
          if (result.shouldUpdateSolution) {
            submitSolution(user._id, result, dispatch);
          }
        }
      }, EVAL_WAIT_TIME);

      renderPuzzleIntoCodeMirror({
        cm,
        puzzle,
        previousSolution,
        onChanges,
      });
    }

    return () => {
      // Remove change handler.
      cm?.off('changes', onChanges);
    };
  }, [codemirror, puzzle, previousSolution, user._id, dispatch]);

  return (
    <Box fill>
      <EditorBar theme={codemirror.theme} keyMap={codemirror.keyMap} />
      <textarea ref={textareaRef} defaultValue={'Loading...'} />
    </Box>
  );
}
