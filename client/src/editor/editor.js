import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateResultsAction } from '../state/actions/ui';
import { submitUserCodeAction } from '../state/actions/entities';
import debounce from 'debounce';
import styled from 'styled-components';
import CodeMirror from 'codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import { firstPos, lastPos } from '../util';

const Wrapper = styled.div`
  border: 1px solid #444;
`;

// Time to wait before eval'ing the user's code
const EVAL_WAIT_TIME = 300;

export class Editor extends Component {
  componentDidMount() {
    // Instantiate and prepare CodeMirror.
    this.cm = new CodeMirror(this.editorEl, {
      showCursorWhenSelecting: true,
      indentWithTabs: true,
      lineWrapping: true,
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4
    });

    // Run code on changes and reflect result
    const onChanges = debounce(() => {
      const { userId, puzzle, userAnswer, updateResults, submitUserCode } = this.props;
      const solution = this.getSolution();

      if (!puzzle || !solution) return updateResults('local', '', '', false);

      // Run code in a "semi"-sandboxed env via iframe - the user can still hang the app with
      // infinite loops and such, but this means breaking the current page is a little less likely
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      // Place iframe within a sandbox
      // TODO: not sure if this actually works
      // FIXME: user can still access top via `window.top`, which cannot be deleted
      iframe.setAttribute('sandbox', '');
      delete iframe.contentWindow.frameElement;

      try {
        // Scope puzzle setup and then inject the user's solution
        // TODO: rather than injecting everything, build the code to run from the puzzle data and
        // the user's solution separately
        const { name: fn } = puzzle;
        const [code, call] = this.cm.getValue().split(new RegExp(`(?=\\n${fn}\\()`));
        const userCode = `(function () {\n${code}\nwindow['${fn}'] = ${fn};\n})();\n${call}`;
        const localResult = JSON.stringify(iframe.contentWindow.eval(userCode));
        const passed = localResult === 'true';

        const shouldUpdateSolution = passed && (!userAnswer || solution.length < userAnswer.length);

        // Display the local result
        updateResults('local', solution, localResult, passed);

        // Here we submit their code to the server for verification
        if (shouldUpdateSolution) {
          submitUserCode(userId, puzzle.name, solution);
        }
      } catch (err) {
        updateResults('local', solution, err.message, false);
      }

      // Remove the iframe from the DOM since we don't need it anymore
      iframe.remove();
    }, EVAL_WAIT_TIME);
    this.cm.on('changes', onChanges);
  }

  // Ensure that our editor is updated each time the component re-renders
  componentDidUpdate() {
    this.renderPuzzleIntoEditor();
  }

  // Retrieves the user's solution from the editor
  getSolution() {
    if (this.editableRegion) {
      const { from, to } = this.editableRegion.find();
      return this.cm.getRange(from, to).trim();
    }
  }

  // Opens the puzzle prefilling the editor with the user's previous solution (if any)
  renderPuzzleIntoEditor() {
    this.editableRegion = null;
    const { puzzle, userAnswer } = this.props;

    if (puzzle) {
      const { source, name } = puzzle;
      const before = `// This is your function ...\n${source}\n\n// ... now make it return true!\n${name}(`;
      const editable = ` ${(userAnswer && userAnswer.solution) || ''} `;
      const after = `);\n`;
      this.cm.setValue(before + editable + after);

      const getPos = (i) => this.cm.posFromIndex(i);

      // Start and end positions of the editable region
      const start = before.length;
      const end = before.length + editable.length;

      // Mark first part of text as read only
      this.cm.markText(firstPos(), getPos(start + 1), {
        inclusiveLeft: true,
        readOnly: true,
        atomic: true
      });

      // Highlight editable region of text
      this.editableRegion = this.cm.markText(getPos(start), getPos(end), {
        clearWhenEmpty: false,
        css: 'background: rgba(178, 178, 178, 0.3);'
      });

      // Mark last part of text as read only
      this.cm.markText(getPos(end - 1), lastPos(this.cm), {
        inclusiveRight: true,
        readOnly: true,
        atomic: true
      });

      this.cm.execCommand('selectAll');
      this.cm.focus();
    }
  }

  render() {
    return <Wrapper innerRef={(c) => (this.editorEl = c)} />;
  }
}

const mapStateToProps = (state) => {
  const puzzle = state.entities.puzzles[state.ui.selectedPuzzle];
  return {
    userId: state.entities.user._id,
    puzzle: puzzle,
    userAnswer: puzzle && state.entities.user.solutions[puzzle.name]
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateResults: (...args) => dispatch(updateResultsAction(...args)),
  submitUserCode: (...args) => dispatch(submitUserCodeAction(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
