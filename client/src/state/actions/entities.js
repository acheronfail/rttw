export const FETCH_USER = 'FETCH_USER';
export const fetchUserAction = (id) => ({
  type: FETCH_USER,
  payload: { id }
});

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const fetchUserSuccessAction = (user) => ({
  type: FETCH_USER_SUCCESS,
  payload: { user }
});

export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const fetchUserFailureAction = (error) => ({
  type: FETCH_USER_FAILURE,
  error
});

export const FETCH_PUZZLES = 'FETCH_PUZZLES';
export const fetchPuzzlesAction = (id) => ({
  type: FETCH_PUZZLES,
  payload: { id }
});

export const FETCH_PUZZLES_SUCCESS = 'FETCH_PUZZLES_SUCCESS';
export const fetchPuzzlesSuccessAction = (puzzles) => ({
  type: FETCH_PUZZLES_SUCCESS,
  payload: { puzzles }
});

export const FETCH_PUZZLES_FAILURE = 'FETCH_PUZZLES_FAILURE';
export const fetchPuzzlesFailureAction = (error) => ({
  type: FETCH_PUZZLES_FAILURE,
  error
});

export const RESET_USER_DATA = 'RESET_USER_DATA';
export const resetUserDataAction = () => ({ type: RESET_USER_DATA });

export const SUBMIT_USER_CODE = 'SUBMIT_USER_CODE';
export const submitUserCodeAction = (code) => ({
  type: SUBMIT_USER_CODE,
  payload: { code }
});
