import React, { Component } from 'react';
import { connect } from 'react-redux';
import { noop } from '../util';
import Modal from '@atlaskit/modal-dialog';
import '@atlaskit/css-reset';
import './app.css';

import { fetchUserAction, fetchPuzzlesAction } from '../state/actions/entities';
import { cyclePuzzleAction, toggleModalAction } from '../state/actions/ui';
import Header from '../header/header';
import Editor from '../editor/editor';
import Nav from '../nav/nav';

export class App extends Component {
  componentDidMount() {
    // Fade in hidden elements
    document.querySelector('.site-footer').classList.add('show');

    // Fetch puzzles and the user (if provided)
    this.props.onStart();
  }

  // Show the congratulations dialog
  renderModal(length) {
    const { cyclePuzzle, closeModal } = this.props;
    const modalActions = [
      { text: 'Stay', onClick: () => closeModal() },
      { text: 'Next Puzzle', onClick: () => cyclePuzzle(1) }
    ];

    return (
      <Modal autoFocus={true} actions={modalActions} onClose={noop} heading="Congratulations! 🎉">
        You returned <strong style={{ color: '#050' }}>true</strong>, awesome!
        <br />
        That's your shortest solution yet: <strong>{length} bytes</strong> 👌
        <br />
        <br />
        You can move on to the next puzzle, or try to find an even shorter answer for this one.
      </Modal>
    );
  }

  render() {
    const { currentSolution, modalOpen } = this.props;
    return (
      <div className="app">
        <Header />
        <div className="container">
          <main>
            <Editor />
            {/* TODO: add in result to state */}
            <pre id="result" style={{ color: true ? '#a00' : 'inherit' }}>
              Result: {`TODO: result`}
              <br />
              Bytecount: {currentSolution.length}
            </pre>
            {modalOpen && this.renderModal()}
          </main>
          <Nav />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modalOpen: state.ui.modalOpen,
  currentSolution: state.ui.currentSolution
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onStart: () => {
    const userId = ownProps.urlParams.get('id');
    if (userId) {
      dispatch(fetchUserAction(userId));
    }
    dispatch(fetchPuzzlesAction());
  },
  cyclePuzzle: (n) => dispatch(cyclePuzzleAction(n)),
  closeModal: () => dispatch(toggleModalAction(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
