import { User } from './types.generated';

// Amount of unsolved puzzles the user can see.
export const VIEWABLE_PUZZLE_COUNT = 3;

// Default template for creating a new user.
export const BLANK_USER: User = {
  _id: undefined,
  username: undefined,
  solutions: {},
};
