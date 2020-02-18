export interface DocumentPuzzle {
  // The order of the puzzle.
  index: number;
  // The name of the puzzle.
  name: string;
  // Source code for the puzzle.
  source: string;
}

export interface DocumentUser {
  // The user's chosen username.
  username?: string;
  // Map of the user's solutions: Puzzle name -> solution.
  solutions: Record<string, string | undefined>;
}

export interface DocumentLeaderboard {
  // The name of the puzzle.
  name: string;
  // Array of high scores (sorted by length, then date).
  scores: {
    // Who's high score is this?
    username: string;
    // The length of their solution.
    length: number;
    // The date the high score was submitted.
    date: Date;
  }[];
}

// Amount of unsolved puzzles the user can see.
export const VIEWABLE_PUZZLE_COUNT = 3;

// Default template for creating a new user.
export const BLANK_USER: DocumentUser = {
  username: undefined,
  solutions: {},
};
