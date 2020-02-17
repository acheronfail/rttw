import { User, Puzzle, SolvedModalState } from './reducer';

export const SET_DARK_MODE = 'SET_DARK_MODE';
export const SET_SHOW_SIDEBAR = 'SET_SHOW_SIDEBAR';
export const SET_EDITOR_OPTION = 'SET_EDITOR_OPTION';
export const SET_SELECTED_PUZZLE = 'SET_SELECTED_PUZZLE';
export const SET_FIRST_UNSOLVED_PUZZLE = 'SET_FIRST_UNSOLVED_PUZZLE';
export const SET_PUZZLES = 'SET_PUZZLES';
export const SET_USER = 'SET_USER';
export const SET_SOLVED_MODAL_STATE = 'SET_SOLVED_MODAL_STATE';

// The constant casts are required to enforce the constant string type on the
// resulting `ActionPayload` type. This is required so the reducer can infer the
// exact types of the payload.

export const setDarkModeAction = (payload: boolean) => ({
  type: SET_DARK_MODE as typeof SET_DARK_MODE,
  payload,
});

export const setShowSidebarAction = (payload: boolean) => ({
  type: SET_SHOW_SIDEBAR as typeof SET_SHOW_SIDEBAR,
  payload,
});

export const setEditorConfigAction = (payload: Partial<CodeMirror.EditorConfiguration>) => ({
  type: SET_EDITOR_OPTION as typeof SET_EDITOR_OPTION,
  payload,
});

export const setSelectedPuzzleAction = (payload: number) => ({
  type: SET_SELECTED_PUZZLE as typeof SET_SELECTED_PUZZLE,
  payload,
});

export const setFirstUnsolvedPuzzleAction = () => ({
  type: SET_FIRST_UNSOLVED_PUZZLE as typeof SET_FIRST_UNSOLVED_PUZZLE,
});

export const setPuzzlesAction = (payload: Puzzle[]) => ({
  type: SET_PUZZLES as typeof SET_PUZZLES,
  payload,
});

export const setUserAction = (payload: Partial<User>) => ({
  type: SET_USER as typeof SET_USER,
  payload,
});

export const setSolvedModalStateAction = (payload: SolvedModalState) => ({
  type: SET_SOLVED_MODAL_STATE as typeof SET_SOLVED_MODAL_STATE,
  payload,
});

export const closeSolvedModalAction = () =>
  setSolvedModalStateAction({
    show: false,
    solutionLength: 0,
  });

export type ActionPayload =
  | ReturnType<typeof setDarkModeAction>
  | ReturnType<typeof setShowSidebarAction>
  | ReturnType<typeof setEditorConfigAction>
  | ReturnType<typeof setSelectedPuzzleAction>
  | ReturnType<typeof setFirstUnsolvedPuzzleAction>
  | ReturnType<typeof setPuzzlesAction>
  | ReturnType<typeof setUserAction>
  | ReturnType<typeof setSolvedModalStateAction>
  | ReturnType<typeof closeSolvedModalAction>;
