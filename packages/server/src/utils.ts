import { DocumentUser } from './types';

export function getSolvedPuzzleCount(user: DocumentUser): number {
  return Object.keys(user.solutions).length;
}
