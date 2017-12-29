import React, { Component } from 'react';
import { AkFieldRadioGroup as RadioGroup } from '@atlaskit/field-radio-group';
import { cycleArray, firstPos, lastPos, itemCreator, resetCSSAnimation } from '../util';
import { puzzles } from '../puzzles';
import { getUserInfo, setUserInfo, clearUserInfo, getUserSolution } from '../user';
import debounce from 'debounce';
import ToolTip from '@atlaskit/tooltip';
import Modal from '@atlaskit/modal-dialog';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import '@atlaskit/css-reset';
import './app.css';

// Time to wait before eval'ing the user's code
const EVAL_WAIT_TIME = 300;
const BLANK_MESSAGE = 'enter some arguments';

export default class App extends Component {
  state = {
    modalOpen: false,
    result: BLANK_MESSAGE,
    index: 0,
    error: false
  };

  // Reloads the window and clears the user's progress
  resetApp() {
    if (window.confirm('This will reset all your data. Continue?')) {
      clearUserInfo();
      this.openPuzzle(0);

      // Restart CSS animations
      resetCSSAnimation('app-logo');
      resetCSSAnimation('app');
    }
  }

  // Resets the required parts of state to change to another puzzle
  resetState(extra = {}) {
    this.setState({
      modalOpen: false,
      result: BLANK_MESSAGE,
      error: false,
      ...extra
    });

    return this;
  }

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
    this.cm.on('changes', debounce(() => {
      const solution = this.getSolution();
      if (solution && solution.length > 0) {
        // Run code in a "semi"-sandboxed env via iframe - the user can still hang the app with 
        // infinite loops and such, but this means breaking the current page is a little less likely
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        
        // Remove reference to parent element
        delete iframe.contentWindow.frameElement;

        try {
          const { name: fn } = puzzles[this.state.index];
          const [puzzle, call] = this.cm.getValue().split(new RegExp(`(?=\\n${fn}\\()`));
          const code = `(function () {\n${puzzle}\nwindow['${fn}'] = ${fn};\n})();\n${call}`;
          const result = JSON.stringify(iframe.contentWindow.eval(code));
          const passed = result === 'true';

          // TODO: better storage management, preferably via a server?
          // At the moment just update the user data if the solution is shorter
          const userInfo = getUserInfo();
          const last = getUserSolution(this.state.index, userInfo);
          const shouldUpdateSolution = passed && (!last || solution.length < last.solution.length);

          if (shouldUpdateSolution) {
            if (last) last.solution = solution;
            else userInfo.completed.push({ index: this.state.index, solution });
            setUserInfo(userInfo);
          }

          // Only show the modal if the current solution is better than the last one
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
    // We keep the `userInfo.completed` array sorted so we can do this simple check
    const completedIds = getUserInfo().completed.map(x => x.index);
    let firstUnsolved = completedIds.findIndex((x, i) => x !== i);
    if (firstUnsolved === -1) firstUnsolved = completedIds.length;
    this.openPuzzle(firstUnsolved);
  }

  // Generates the items for the side nav
  getNavItems() {
    const userInfo = getUserInfo();
    const completedIds = userInfo.completed.map(x => x.index);
    const makeItem = itemCreator('puzzle');
    return puzzles.map(({ name }, i) => {
      const existing = getUserSolution(i, userInfo);
      return makeItem(`${i}`, name, completedIds.includes(i), {
        statusText: existing && existing.solution.length + ' bytes',
        isSelected: i === this.state.index,
        isDisabled: i > userInfo.completed.length + 2
      });
    });
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

  renderHeader() {
    return (
      <header className="app-header">
        <div className="app-logo">
          <code>true</code>
        </div>
        <ToolTip content="Click this to reset everything!" position="right">
          <div className="rainbow-wrapper">
            <button onClick={() => this.resetApp()} className="app-title">Return true to win!</button>
          </div>
        </ToolTip>
      </header>
    );
  }

  renderModal(length) {
    const modalActions = [
      { text: 'Stay', onClick: () => this.setState({ modalOpen: false }) },
      { text: 'Next Puzzle', onClick: () => this.cycle(1) }
    ];

    return (
      <Modal
        autoFocus={true}
        actions={modalActions}
        onClose={() => { }}
        heading="Congratulations! 🎉"
      >
        You returned <strong style={{ color: '#050' }}>true</strong>, awesome!
        <br />
        That's your shortest solution yet: <strong>{length} bytes</strong> 👌
        <br /><br />
        You can move on to the next puzzle, or try to find an even shorter answer for this one.
      </Modal>
    );
  }

  renderNav() {
    return (
      <nav>
        <h3>Puzzles</h3>
        <div className="list">
          <RadioGroup
            onRadioChange={({ target: { value } }) => this.openPuzzle(value | 0)}
            items={this.getNavItems()}
          />
        </div>
      </nav>
    );
  }

  render() {
    const { error, result, modalOpen } = this.state;

    let length = 0;
    {
      let solution = this.getSolution();
      if (solution) length = solution.length;
    }

    return (
      <div className="app">
        {this.renderHeader()}
        <div className="container">
          <main>
            <div ref={c => this.editorEl = c}></div>
            <pre id="result" style={{ color: error ? '#a00' : 'inherit' }}>
              Result: {result}
              <br />
              Bytecount: {length}
            </pre>
            {modalOpen && this.renderModal(length)}
          </main>
          {this.renderNav()}
        </div>
      </div>
    );
  }
};
