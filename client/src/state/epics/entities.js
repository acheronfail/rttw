import { combineEpics } from 'redux-observable';
import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  // FETCH_USER_FAILURE,
  FETCH_PUZZLES,
  FETCH_PUZZLES_SUCCESS
  // FETCH_PUZZLES_FAILURE,
} from '../actions/entities';
import { Observable } from 'rxjs/Observable';
import { performGetRequest } from '../../util';

export const fetchUserEpic = (action$, store) => {
  return action$.ofType(FETCH_USER).mergeMap((action) => {
    console.log('epic...');
    return Observable.from(fetch(`/api/user/${action.payload.id}`))
      .map((user) => ({
        type: FETCH_USER_SUCCESS,
        payload: { user }
      }))
      .catch((...args) => {
        console.error(...args);
        return Observable.empty();
      });
  });
};

export const fetchPuzzlesEpic = (action$, store) => {
  return action$.ofType(FETCH_PUZZLES).mergeMap((action) => {
    return Observable.from(performGetRequest(`/api/puzzles/${action.payload.id || ''}`))
      .map(({ result }) => ({
        type: FETCH_PUZZLES_SUCCESS,
        payload: { puzzles: result }
      }))
      .catch((...args) => {
        console.error(123, ...args);
        return Observable.empty();
      });
  });
};

export default combineEpics(fetchUserEpic, fetchPuzzlesEpic);
