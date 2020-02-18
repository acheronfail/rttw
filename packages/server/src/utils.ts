import { User } from '@rttw/common';

export function getSolvedPuzzleCount(user: User): number {
  return Object.keys(user.solutions).length;
}
