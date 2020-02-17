import { Box, Button, Heading, CheckBox, Text } from 'grommet';
import { List } from 'grommet-icons';
import React from 'react';
import { useStoreContext } from '../store';
import { setDarkModeAction, setShowSidebarAction } from '../store/actions';
// TODO: convert to styled component?
import './header.css';

export function Header() {
  const { state, dispatch } = useStoreContext();
  const { darkMode, showSidebar, selectedPuzzleIndex } = state.client;
  const { puzzles } = state.server;

  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="start"
      background="brand"
      pad="small"
      elevation="medium"
      style={{ zIndex: 1 }}
    >
      <Button icon={<List />} onClick={() => dispatch(setShowSidebarAction(!showSidebar))} />
      <div className="rainbow-wrapper">
        <Box background="brand" justify="center" align="center">
          <Text> Return True To Win </Text>
        </Box>
      </div>
      <Heading level="4" margin={{ horizontal: '20px', vertical: 'none' }}>
        {puzzles[selectedPuzzleIndex]?.name}
      </Heading>
      <Box flex direction="row" align="end" justify="end">
        <CheckBox
          toggle
          label="Dark"
          checked={darkMode}
          onChange={e => dispatch(setDarkModeAction(e.target.checked))}
        />
      </Box>
    </Box>
  );
}

export default Header;
