export const SELECT_PUZZLE = 'SELECT_PUZZLE';
export const selectPuzzleAction = (index) => ({
  type: SELECT_PUZZLE,
  payload: { index }
});

export const CYCLE_PUZZLE = 'CYCLE_PUZZLE';
export const cyclePuzzleAction = (n) => ({
  type: CYCLE_PUZZLE,
  payload: { n }
});

export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const toggleModalAction = (flag) => ({
  type: TOGGLE_MODAL,
  payload: { flag }
});
