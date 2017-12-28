import React, { Component } from 'react';
import { AkFieldRadioGroup as RadioGroup } from '@atlaskit/field-radio-group';
import ToolTip from '@atlaskit/tooltip';
import Modal from '@atlaskit/modal-dialog';
import debounce from 'debounce';

import '@atlaskit/css-reset';
import './app.css';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';

import { cycleArray, firstPos, lastPos, itemCreator } from '../util';
import { puzzles } from '../puzzles';

import { getUserInfo, setUserInfo, clearUserInfo, getUserSolution } from '../user';

const EVAL_WAIT_TIME = 300;

class App extends Component {
  state = {
    modalOpen: false,
    result: 'start typing to eval',
    index: 0,
    error: false
  };

  // Reloads the window and clears the user's progress
  resetApp() {
    clearUserInfo();
    setTimeout(() => {
      this.openPuzzle(0);
    }, 0);
  }

  // Resets the required parts of state to change to another puzzle
  resetState(extra = {}) {
    this.setState({
      modalOpen: false,
      result: '',
      error: false,
      ...extra
    });

    return this;
  }

  componentDidMount() {
    // Instantiate and prepare CodeMirror.
    const cm = this.cm = new CodeMirror(this.editorEl, {
      showCursorWhenSelecting: true,
      indentWithTabs: true,
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4
    });
    
    // Run code on changes and reflect result
    cm.on('changes', debounce(() => {
      const solution = this.getSolution();
      if (solution && solution.length > 0) {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        delete iframe.contentWindow.frameElement;

        try {
          const result = JSON.stringify(iframe.contentWindow.eval(cm.getValue()));
          const passed = result === 'true';

          // TODO: make a much better way of handling storage and user info!!!

          // At the moment just update the user data if the solution is shorter
          const userInfo = getUserInfo();
          const last = getUserSolution(this.state.index, userInfo);
          const shouldUpdateSolution = passed && (!last || solution.length < last.solution.length);

          if (shouldUpdateSolution) {
            if (last) last.solution = solution;
            else userInfo.completed.push({ index: this.state.index, solution });
            setUserInfo(userInfo);
          }

          this.setState({
            result,
            error: false,
            modalOpen: shouldUpdateSolution
          });
        } catch (e) {
          this.setState({
            result: e.message,
            error: true
          });
        }

        iframe.remove();
      } else {
        this.resetState();
      }
    }, EVAL_WAIT_TIME));

    
    // Start at first unsolved puzzle
    const completedIds = getUserInfo().completed.map(x => x.index);
    let firstUnsolved = completedIds.findIndex((x, i) => x !== i);
    if (firstUnsolved === -1) firstUnsolved = completedIds.length;
    this.openPuzzle(firstUnsolved);
  }

  // Generates the items for the side nav
  getNavItems() {
    const { completed } = getUserInfo();
    const completedIds = completed.map(x => x.index);
    const makeItem = itemCreator('color');
    return puzzles.map(({ name }, i) => makeItem(`${i}`, name, completedIds.includes(i), {
      isSelected: i === this.state.index,
      isDisabled: i > completed.length + 2
    }));
  }

  // Retrieves the user's solution
  getSolution() {
    if (this.editableRegion) {
      const { from, to } = this.editableRegion.find();
      return this.cm.getRange(from, to).trim();
    }
  }

  // Opens the puzzle at the given index, prefilling it with the user's previous solution (if any)
  openPuzzle(index) {
    this.editableRegion = null;
    this.resetState({ index });
    
    const { source, name } = puzzles[index];
    const answer = getUserSolution(index);

    const before = `// This is your function ...\n${source}\n\n// ... now make it return true!\n${name}(`;
    const editable = ` ${(answer && answer.solution) || ''} `;
    const after = `);\n`;
    this.cm.setValue(before + editable + after);

    const getPos = (i) => this.cm.posFromIndex(i);

    // Start and end positions of the editable region
    const start = before.length, end = before.length + editable.length;
    
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

  // Cycles through the puzzles, wrapping around the end of the list
  cycle(dir = 1) {
    if (this.cm) {
      const index = this.state.index + dir;
      this.openPuzzle(cycleArray(puzzles, index));
    }
  }

  render() {
    const { error, result, modalOpen } = this.state;
    const modalActions = [
      { text: 'Stay', onClick: () => this.setState({ modalOpen: false }) },
      { text: 'Next Puzzle', onClick: () => this.cycle(1) }
    ];

    return (
      <div className="App">
        <header className="App-header">
          <div className="App-logo">
            <code>true</code>
          </div>
          <ToolTip content="Click this to reset everything!" position="right">
            <div className="rainbow-wrapper">
              <button onClick={() => this.resetApp()} className="App-title">Return true to win!</button>
            </div>
          </ToolTip>
        </header>
        <div className="container">
          <main>
            <div ref={c => this.editorEl = c}></div>
            <pre id="result" style={{ color: error ? '#a00' : 'inherit' }}>Result: {result}</pre>
            {modalOpen && (
              <Modal actions={modalActions} onClose={() => {}} heading="Congratulations! 🎉">
                You returned <strong style={{ color: '#050' }}>true</strong>, awesome!
                <br />
                That's your shortest solution yet: <strong>{this.getSolution().length} byte(s)</strong> 👌
                <br />
                <br />
                You can move on to the next puzzle, or try to find an even shorter answer for this one.
              </Modal>
            )}
          </main>
          <nav>
            <h3>Puzzles</h3>
            <div className="list">
              <RadioGroup
                onRadioChange={({ target: { value }}) => this.openPuzzle(value | 0)}
                items={this.getNavItems()}
              />
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;