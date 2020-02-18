import React, { createContext, Props, useReducer, Dispatch, useContext } from 'react';
import { ActionPayload, setPuzzlesAction } from './actions';
import { reducer, initialState, State } from './reducer';

export interface Store {
  state: State;
  dispatch: Dispatch<ActionPayload>;
}

export const Store = createContext<Store | undefined>(undefined);

function __rttwAddDevelopmentHooks(store: Store) {
  const { state, dispatch } = store;
  const global = window as any;

  global.__rttwStore = store;
  global.__rttwPuzzleSource = (name: string) => {
    const { puzzles } = state.server;
    for (const p of puzzles) {
      if (p.name === name) {
        return p.source;
      }
    }
  };
  global.__rttwUpdatePuzzle = (name: string, value: string | Function) => {
    const { puzzles } = state.server;
    dispatch(
      setPuzzlesAction(
        puzzles.map(p => {
          if (p.name === name) {
            p.source = typeof value === 'string' ? value : value.toString();
          }

          return p;
        }),
      ),
    );
  };
}

export function StoreProvider({ children }: Props<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = { state, dispatch };

  if (process.env.NODE_ENV === 'development') {
    __rttwAddDevelopmentHooks(store);
  }

  return <Store.Provider value={store}>{children}</Store.Provider>;
}

export function useStoreContext(): Store {
  const context = useContext(Store);
  if (!context) {
    throw new Error('useStoreContext() must be wrapped in <StoreProvider>');
  }

  return context;
}
