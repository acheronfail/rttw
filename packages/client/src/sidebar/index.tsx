import { Puzzle, User } from '@rttw/common';
import { Box, Button, Collapsible, Heading, Layer, RadioButtonGroup, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import React, { ChangeEvent } from 'react';
import { Status } from '../status';
import { useStoreContext } from '../store';
import { setSelectedPuzzleAction, setShowSidebarAction } from '../store/actions';

export interface PuzzleListProps {
  user: User;
  puzzles: Puzzle[];
  selectedPuzzleIndex: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function PuzzleList({ puzzles, selectedPuzzleIndex, onChange, user }: PuzzleListProps) {
  const options = puzzles.map((p, i) => {
    const id = i.toString();
    const userSolution = user.solutions[p.name];

    const status = userSolution ? (
      <Status type="solved" label={`${userSolution.length} bytes`} />
    ) : (
      <Status type="unsolved" label="unsolved" />
    );
    return {
      id,
      value: id,
      label: (
        <Box direction="row" justify="center" align="center">
          {status}&nbsp;{p.name}
        </Box>
      ),
    };
  });

  return (
    <Box fill pad="small" justify="start" align="start">
      <Heading level="3">Puzzles</Heading>
      {options.length ? (
        <RadioButtonGroup name="puzzle" options={options} value={selectedPuzzleIndex.toString()} onChange={onChange} />
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
}

export interface SidebarProps {
  size: string;
}

export function Sidebar({ size }: SidebarProps) {
  const { state, dispatch } = useStoreContext();
  const { showSidebar, selectedPuzzleIndex } = state.client;
  const { puzzles, user } = state.server;

  const puzzleList = (
    <PuzzleList
      user={user}
      puzzles={puzzles}
      selectedPuzzleIndex={selectedPuzzleIndex}
      onChange={e => dispatch(setSelectedPuzzleAction(parseInt(e.target.value, 10)))}
    />
  );

  return (
    <>
      {!showSidebar || size !== 'small' ? (
        <Collapsible direction="horizontal" open={showSidebar}>
          <Box flex border="right" width="medium" elevation="small" align="center" justify="center">
            {puzzleList}
          </Box>
        </Collapsible>
      ) : (
        <Layer>
          <Box pad="small" tag="header" background="brand" justify="start" align="center" direction="row">
            <Button icon={<FormClose />} onClick={() => dispatch(setShowSidebarAction(false))} />
          </Box>
          <Box fill align="center" justify="center">
            {puzzleList}
          </Box>
        </Layer>
      )}
    </>
  );
}
