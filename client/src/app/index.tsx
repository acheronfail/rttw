import { Box, Grommet, ResponsiveContext } from 'grommet';
import React, { useEffect } from 'react';
import { getPuzzles } from '../api';
import { Editor } from '../editor';
import Header from '../header';
import { Sidebar } from '../sidebar';
import { useStoreContext } from '../store';
import { setNextUnsolvedPuzzleAction } from '../store/actions';
import { SolvedModal } from './modal';
import * as themes from './themes';

export interface AppProps {
  urlParams: URLSearchParams;
}

function App({ urlParams }: AppProps) {
  const { state, dispatch } = useStoreContext();
  const { darkMode, solvedModal } = state.client;

  // Fetch initial puzzles.
  useEffect(() => {
    getPuzzles(urlParams.get('id'), dispatch).then(() => {
      // Select first unsolved puzzle.
      dispatch(setNextUnsolvedPuzzleAction());
    });
    // NOTE: we only want this to run once, so no dependencies here.
    // eslint-disable-next-line
  }, []);

  return (
    <Grommet theme={darkMode ? themes.dark : themes.light} full themeMode={darkMode ? 'dark' : 'light'}>
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <Header />
            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <Sidebar size={size} />
              <Editor />
            </Box>
            {solvedModal.show && <SolvedModal />}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
