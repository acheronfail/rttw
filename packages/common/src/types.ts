export interface Puzzle {
  // The order of the puzzle.
  index: number;
  // The name of the puzzle.
  name: string;
  // Source code for the puzzle.
  source: string;
}

export interface User {
  // TODO: remove this, and map it to just `id`
  _id: any;
  // The user's chosen username.
  username?: string;
  // Map of the user's solutions: Puzzle name -> solution.
  solutions: Record<string, string | undefined>;
}

export interface LeaderboardEntry {
  // Who's high score is this?
  username: string;
  // The length of their solution.
  length: number;
  // The date the high score was submitted.
  date: Date;
}

export interface Leaderboard {
  // The name of the puzzle.
  name: string;
  // Array of high scores (sorted by length, then date).
  scores: LeaderboardEntry[];
}

//
// API Interfaces
//

export interface ApiGetPuzzlesResponse {
  puzzles: Puzzle[];
  user: User;
}

export interface ApiPostSubmitRequest {
  // The id of the user.
  id: string;
  // The name of the puzzle.
  name: string;
  // The user's solution for the puzzle.
  solution: string;
}

export interface ApiPostSubmitResponse {
  // The most up to date user object.
  user: User;
}
