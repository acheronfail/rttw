export interface DocumentPuzzle {
  index: number;
  name: string;
  source: string;
}

export interface DocumentUser {
  solutions: Record<string, string>;
}

// Amount of unsolved puzzles the user may see
export const VIEWABLE_PUZZLE_COUNT = 3;

export const BLANK_USER: DocumentUser = {
  solutions: {},
};
