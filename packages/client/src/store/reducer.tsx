import { Puzzle, User } from '@rttw/common';
import {
  ActionPayload,
  SET_DARK_MODE,
  SET_EDITOR_OPTION,
  SET_NEXT_UNSOLVED_PUZZLE,
  SET_PUZZLES,
  SET_SELECTED_PUZZLE,
  SET_SHOW_SIDEBAR,
  SET_SOLVED_MODAL_STATE,
  SET_USER,
} from './actions';

export interface SolvedModalState {
  show: boolean;
  solutionLength: number;
}

export interface State {
  // Local, client-side state.
  client: {
    darkMode: boolean;
    showSidebar: boolean;
    codemirror: Partial<CodeMirror.EditorConfiguration>;
    selectedPuzzleIndex: number;
    solvedModal: SolvedModalState;
  };

  // Remote, server-retrieved state.
  server: {
    user: User;
    puzzles: Puzzle[];
  };
}

// TODO: save selected parts of state locally in the browser
export const initialState: State = {
  client: {
    darkMode: true,
    // TODO: default to false on smaller screens
    showSidebar: true,
    codemirror: {
      lineNumbers: true,
      showCursorWhenSelecting: true,
      mode: 'javascript',
      theme: 'monokai',
      keyMap: 'default',
      tabSize: 2,
    },
    selectedPuzzleIndex: 0,
    solvedModal: {
      show: false,
      solutionLength: 0,
    },
  },

  server: {
    user: {
      _id: null,
      solutions: {},
    },
    puzzles: [],
  },
};

export function reducer(state: State, action: ActionPayload): State {
  if (process.env.NODE_ENV === 'development') {
    console.log(action.type);
  }

  switch (action.type) {
    case SET_DARK_MODE:
      return { ...state, client: { ...state.client, darkMode: action.payload } };
    case SET_SHOW_SIDEBAR:
      return { ...state, client: { ...state.client, showSidebar: action.payload } };
    case SET_EDITOR_OPTION:
      return { ...state, client: { ...state.client, codemirror: { ...state.client.codemirror, ...action.payload } } };
    case SET_SELECTED_PUZZLE:
      return { ...state, client: { ...state.client, selectedPuzzleIndex: action.payload } };
    case SET_NEXT_UNSOLVED_PUZZLE:
      const { puzzles, user } = state.server;
      const { selectedPuzzleIndex: i } = state.client;
      const solved = Object.keys(user.solutions);
      const puzzlesFromCurrentIndex = puzzles.slice(i).concat(puzzles.slice(0, i));
      const index =
        Math.max(
          0,
          puzzlesFromCurrentIndex.findIndex(p => !solved.includes(p.name)),
        ) + i;
      return { ...state, client: { ...state.client, selectedPuzzleIndex: index } };
    case SET_PUZZLES:
      return { ...state, server: { ...state.server, puzzles: action.payload } };
    case SET_USER:
      // Update URL with user id.
      if (action.payload._id && state.server.user._id !== action.payload._id) {
        const params = new URLSearchParams();
        params.append('id', action.payload._id);
        window.location.hash = params.toString();
      }

      return { ...state, server: { ...state.server, user: { ...state.server.user, ...action.payload } } };
    case SET_SOLVED_MODAL_STATE:
      return { ...state, client: { ...state.client, solvedModal: action.payload } };
  }

  return state;
}
