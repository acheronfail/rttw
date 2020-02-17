import React, { createContext, Props, useReducer, Dispatch, useContext } from 'react';
import { ActionPayload } from './actions';
import { reducer, initialState, State } from './reducer';

export interface Store {
  state: State;
  dispatch: Dispatch<ActionPayload>;
}

export const Store = createContext<Store | undefined>(undefined);

export function StoreProvider({ children }: Props<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export function useStoreContext(): Store {
  const context = useContext(Store);
  if (!context) {
    throw new Error('useStoreContext() must be wrapped in <StoreProvider>');
  }

  return context;
}
