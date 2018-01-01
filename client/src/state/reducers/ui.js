import { SELECT_PUZZLE, CYCLE_PUZZLE, TOGGLE_MODAL } from '../actions/ui';
import { cycleArray } from '../../util';

const initialState = {
  modalOpen: false,
  selectedPuzzle: 0,
  currentSolution: ''
};

export const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_PUZZLE: {
      return Object.assign({}, state, { selectedPuzzle: action.payload.index });
    }
    case CYCLE_PUZZLE: {
      return Object.assign({}, state, {
        selectedPuzzle: cycleArray(state.selectedPuzzle + action.payload.n)
      });
    }
    case TOGGLE_MODAL: {
      return Object.assign({}, state, { modalOpen: action.payload.flag });
    }
    default: {
      return state;
    }
  }
};

export default uiReducer;
