import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_PUZZLES,
  FETCH_PUZZLES_SUCCESS,
  FETCH_PUZZLES_FAILURE,
  RESET_USER_DATA,
  SUBMIT_USER_CODE
} from '../actions/entities';

const initialState = {
  user: {
    _id: '',
    username: null,
    solutions: {}
  },
  puzzles: []
};

export const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER: {
      // TODO:
      console.log(FETCH_USER, 'redux observable?');
      return state;
    }
    case FETCH_USER_FAILURE: {
      // TODO: ui?
      return state;
    }
    case FETCH_USER_SUCCESS: {
      const { user } = action.payload;
      return Object.assign({}, state, { user });
    }
    case FETCH_PUZZLES: {
      // TODO:
      console.log(FETCH_PUZZLES, 'redux observable?');
      return state;
    }
    case FETCH_PUZZLES_FAILURE: {
      // TODO: ui?
      return state;
    }
    case FETCH_PUZZLES_SUCCESS: {
      const { puzzles } = action.payload;
      return Object.assign({}, state, { puzzles });
    }
    case RESET_USER_DATA: {
      // TODO:
      return state;
    }
    case SUBMIT_USER_CODE: {
      // TODO: epic ?
      return state;
    }
    default: {
      return state;
    }
  }
};

export default entitiesReducer;
