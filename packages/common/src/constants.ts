import { User } from './types';

// Amount of unsolved puzzles the user can see.
export const VIEWABLE_PUZZLE_COUNT = 3;

// Default template for creating a new user.
export const BLANK_USER: User = {
  _id: null,
  username: undefined,
  solutions: {},
};
