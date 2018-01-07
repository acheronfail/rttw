import { SELECT_PUZZLE, CYCLE_PUZZLE, TOGGLE_MODAL, UPDATE_RESULTS } from '../actions/ui';
import { SUBMIT_USER_CODE, PUZZLE_COMPLETED } from '../actions/entities';
import { cycleArray } from '../../util';

const initialUIState = {
  // The user's current solution: used for bytecount
  solution: '',
  // Text to be displayed in the "results" box
  results: '',
  // Whether or not the current result was successful
  resultSuccessful: false,
  // Whether or not the current result has been verified by the server
  resultVerified: false,
  // Whether or not to display the "congratulations" modal
  modalOpen: false,
  // The index of the currently selected puzzle
  selectedPuzzle: 0,
  // The user's current solution
  currentSolution: ''
};

export const uiReducer = (uiState = initialUIState, action) => {
  switch (action.type) {
    case SELECT_PUZZLE: {
      return Object.assign({}, uiState, { selectedPuzzle: action.payload.index });
    }
    case CYCLE_PUZZLE: {
      const { length, n } = action.payload;
      return Object.assign({}, uiState, {
        modalOpen: false,
        selectedPuzzle: cycleArray(length, uiState.selectedPuzzle + n)
      });
    }
    case TOGGLE_MODAL: {
      return Object.assign({}, uiState, { modalOpen: action.payload.flag });
    }
    case UPDATE_RESULTS: {
      const { origin, solution, results, resultSuccessful } = action.payload;
      const resultVerified = origin === 'server';
      return Object.assign({}, uiState, { results, solution, resultSuccessful, resultVerified });
    }
    case SUBMIT_USER_CODE: {
      // TODO: loading indicator ?
      return uiState;
    }
    case PUZZLE_COMPLETED: {
      // Update URL with user id
      const params = new URLSearchParams();
      params.append('id', action.payload.user._id);
      window.location.hash = params.toString();

      return Object.assign({}, uiState, { modalOpen: true });
    }
    default: {
      return uiState;
    }
  }
};

export default uiReducer;
