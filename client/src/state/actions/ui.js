export const SELECT_PUZZLE = 'SELECT_PUZZLE';
export const selectPuzzleAction = (index) => ({
  type: SELECT_PUZZLE,
  payload: { index }
});

export const CYCLE_PUZZLE = 'CYCLE_PUZZLE';
export const cyclePuzzleAction = (length, n) => ({
  type: CYCLE_PUZZLE,
  payload: { length, n }
});

export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const toggleModalAction = (payload) => ({
  type: TOGGLE_MODAL,
  payload
});

export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const updateResultsAction = (origin, solution, results, resultSuccessful) => ({
  type: UPDATE_RESULTS,
  payload: { origin, solution, results, resultSuccessful }
});
