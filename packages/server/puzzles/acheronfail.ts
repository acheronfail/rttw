import { Puzzle } from '@rttw/common/src';

export const acheronfail: Puzzle[] = [
  {
    index: 0,
    name: 'tryCatch',
    source: `function tryCatch(fn) {
  try {
    fn();
    return false;
  } catch (error) {
    fn();
    return false;
  } finally {
    return fn();
  }
}`,
  },
];
