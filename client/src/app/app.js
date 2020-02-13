import React, { Component } from 'react';
import { connect } from 'react-redux';
import { noop, bounceIn } from '../util';
import Modal from '@atlaskit/modal-dialog';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import './app.css';

import { fetchPuzzlesAction } from '../state/actions/entities';
import { cyclePuzzleAction, toggleModalAction } from '../state/actions/ui';
import Results from '../results/results';
import Header from '../header/header';
import Editor from '../editor/editor';
import Nav from '../nav/nav';

const Wrapper = styled.div`
  min-width: 768px;
  max-width: 1024px;
  box-shadow: 0 5px 15px #222;
  border-radius: 5px;
  animation: ${bounceIn} 750ms ease-in;
`;

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Main = styled.main`
  padding: 10px;
  order: 1;
  flex: 3;
`;

export class App extends Component {
  componentDidMount() {
    // Fade in hidden elements
    document.querySelector('.site-footer').classList.add('show');

    // Fetch puzzles and the user (if provided)
    this.props.onStart();
  }

  // Show the congratulations dialog
  renderModal() {
    const { modalState, cyclePuzzle, puzzlesCount, closeModal } = this.props;
    const { solutionLength } = modalState;
    const modalActions = [
      { text: 'Stay', onClick: () => closeModal() },
      { text: 'Next Puzzle', onClick: () => cyclePuzzle(puzzlesCount, 1) }
    ];

    return (
      <Modal autoFocus={true} actions={modalActions} onClose={noop} heading="Congratulations! 🎉">
        You returned <strong style={{ color: '#050' }}>true</strong>, awesome!
        <br />
        That's your shortest solution yet: <strong>{solutionLength} bytes</strong> 👌
        <br />
        <br />
        You can move on to the next puzzle, or try to find an even shorter answer for this one.
      </Modal>
    );
  }

  render() {
    const { modalState } = this.props;
    return (
      <Wrapper>
        <Header />
        <Container>
          <Main>
            <Editor />
            <Results />
            {modalState && this.renderModal()}
          </Main>
          <Nav />
        </Container>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  modalState: state.ui.modalState,
  puzzlesCount: state.entities.puzzles.length
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onStart: () => {
    const userId = ownProps.urlParams.get('id');
    dispatch(fetchPuzzlesAction(userId));
  },
  cyclePuzzle: (length, n) => dispatch(cyclePuzzleAction(length, n)),
  closeModal: () => dispatch(toggleModalAction(null))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
