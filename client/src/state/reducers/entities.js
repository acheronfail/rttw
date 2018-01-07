import {
  FETCH_PUZZLES_SUCCESS,
  FETCH_PUZZLES_FAILURE,
  RESET_USER_DATA,
  PUZZLE_COMPLETED
} from '../actions/entities';

const initialEntitiesState = {
  user: {
    _id: null,
    username: null,
    solutions: {}
  },
  puzzles: []
};

export const entitiesReducer = (entitiesState = initialEntitiesState, action) => {
  switch (action.type) {
    case FETCH_PUZZLES_FAILURE: {
      // TODO: error - ui?
      return entitiesState;
    }
    case FETCH_PUZZLES_SUCCESS: {
      const { puzzles, user } = action.payload;
      return Object.assign({}, entitiesState, { puzzles, user });
    }
    case RESET_USER_DATA: {
      // TODO:
      return entitiesState;
    }
    case PUZZLE_COMPLETED: {
      const { user } = action.payload;
      return Object.assign({}, entitiesState, { user });
    }
    default: {
      return entitiesState;
    }
  }
};

export default entitiesReducer;
