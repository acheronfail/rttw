import {
  ActionPayload,
  SET_DARK_MODE,
  SET_SHOW_SIDEBAR,
  SET_EDITOR_OPTION,
  SET_SELECTED_PUZZLE,
  SET_USER,
  SET_PUZZLES,
  SET_FIRST_UNSOLVED_PUZZLE,
  SET_SOLVED_MODAL_STATE,
} from './actions';

// TODO: separate package for types (share with server?)
export interface Puzzle {
  name: string;
  source: string;
}
export interface User {
  // TODO: map this to just `id` in the server
  _id: string | null;
  solutions: Record<string, string | undefined>;
}

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
  if (process.env.NODE_ENV) {
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
    case SET_FIRST_UNSOLVED_PUZZLE:
      const puzzlesSolved = Object.keys(state.server.user.solutions);
      const selectedPuzzleIndex = Math.max(
        0,
        state.server.puzzles.findIndex(p => !puzzlesSolved.includes(p.name)),
      );
      return { ...state, client: { ...state.client, selectedPuzzleIndex } };
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