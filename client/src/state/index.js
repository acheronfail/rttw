import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import entities from './reducers/entities';
import entitiesEpic from './epics/entities';
import ui from './reducers/ui';

// TODO: get rid of rxjs and just use react hooks instead
import 'rxjs';

export const rootEpic = combineEpics(entitiesEpic);
export const rootReducer = combineReducers({ entities, ui });
