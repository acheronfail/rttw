export const FETCH_PUZZLES = 'FETCH_PUZZLES';
export const fetchPuzzlesAction = (id) => ({
  type: FETCH_PUZZLES,
  payload: { id }
});

export const FETCH_PUZZLES_SUCCESS = 'FETCH_PUZZLES_SUCCESS';
export const fetchPuzzlesSuccessAction = (puzzles, user) => ({
  type: FETCH_PUZZLES_SUCCESS,
  payload: { puzzles, user }
});

export const FETCH_PUZZLES_FAILURE = 'FETCH_PUZZLES_FAILURE';
export const fetchPuzzlesFailureAction = (error) => ({
  type: FETCH_PUZZLES_FAILURE,
  error
});

export const SUBMIT_USER_CODE = 'SUBMIT_USER_CODE';
export const submitUserCodeAction = (id, name, solution) => ({
  type: SUBMIT_USER_CODE,
  payload: { id, name, solution }
});

export const PUZZLE_COMPLETED = 'PUZZLE_COMPLETED';
export const puzzleCompletedAction = (user) => ({
  type: PUZZLE_COMPLETED,
  payload: { user }
});
