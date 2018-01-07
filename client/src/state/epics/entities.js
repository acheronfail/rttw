import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { FETCH_PUZZLES, SUBMIT_USER_CODE, PUZZLE_COMPLETED } from '../actions/entities';
import {
  puzzleCompletedAction,
  fetchPuzzlesAction,
  fetchPuzzlesSuccessAction,
  fetchPuzzlesFailureAction
} from '../actions/entities';
import { selectPuzzleAction } from '../actions/ui';
import { performGetRequest, performPostRequest } from '../../util';

let requestCount = 0;
export const fetchPuzzlesEpic = (action$, store) => {
  return action$.ofType(FETCH_PUZZLES).switchMap((action) => {
    return Observable.from(performGetRequest(`/api/puzzles/${action.payload.id || ''}`))
      .flatMap(({ puzzles, user }) => {
        const actions = [fetchPuzzlesSuccessAction(puzzles, user)];

        // If this was the first request, then also emit a select puzzle action to select the
        // first unsolved puzzle. The puzzles should come sorted from the server so we can simply
        // iterate through the list
        if (requestCount++ === 0) {
          const { solutions } = user;
          const puzzleNames = Object.keys(solutions);
          const firstUnsolvedPuzzle = puzzles.find((puzzle) => !puzzleNames.includes(puzzle.name));

          if (firstUnsolvedPuzzle) {
            actions.push(selectPuzzleAction(firstUnsolvedPuzzle.index));
          }
        }

        return Observable.from(actions);
      })
      .catch((err) => Observable.of(fetchPuzzlesFailureAction(err)));
  });
};

export const submitUserCodeEpic = (action$, store) => {
  return action$.ofType(SUBMIT_USER_CODE).switchMap((action) => {
    const { id, name, solution } = action.payload;
    return Observable.from(performPostRequest('/api/submit', { id, name, solution }))
      .map(({ result }) => puzzleCompletedAction(result))
      .catch((err) => {
        // TODO: handle err here ?
        console.error(err);
        return Observable.empty();
      });
  });
};

export const puzzleCompletedEpic = (action$, store) => {
  return action$.ofType(PUZZLE_COMPLETED).map((action) => {
    const { user: { _id } } = action.payload;
    return fetchPuzzlesAction(_id);
  });
};

export default combineEpics(fetchPuzzlesEpic, submitUserCodeEpic, puzzleCompletedEpic);
