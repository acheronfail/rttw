import { Box, Keyboard, Layer, Markdown } from 'grommet';
import React from 'react';
import Button from '../button';
import { useStoreContext } from '../store';
import { closeSolvedModalAction, setNextUnsolvedPuzzleAction } from '../store/actions';

const modalMessage = (solutionLength: number) => `
## Congratulations! 🎉

#### You returned \`true\`, awesome!

That's your shortest solution yet: **${solutionLength} characters**. 👌
Feel free to move onto the next puzzle, or try to find an even shorter answer for this one.`;

const buttonMargin = { horizontal: 'xsmall' };

export function SolvedModal() {
  const { state, dispatch } = useStoreContext();
  const { solvedModal } = state.client;
  const { solutionLength } = solvedModal;

  const closeModal = () => dispatch(closeSolvedModalAction());
  const nextPuzzle = () => {
    dispatch(setNextUnsolvedPuzzleAction());
    closeModal();
  };

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} animation="fadeIn">
      <Keyboard target="document" onEnter={closeModal} onEsc={closeModal}>
        <Box fill pad="medium" round="small" elevation="large">
          <Box fill pad={{ horizontal: 'medium', vertical: 'small' }} align="center" justify="center">
            <Markdown>{modalMessage(solutionLength)}</Markdown>
          </Box>
          <Box direction="row" justify="end">
            <Button focus margin={buttonMargin} label="Stay" primary onClick={closeModal} />
            <Button margin={buttonMargin} label="Next Puzzle" onClick={nextPuzzle} />
          </Box>
        </Box>
      </Keyboard>
    </Layer>
  );
}
