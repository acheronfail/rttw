import { Box, Text } from 'grommet';
import { FormCheckmark, FormClose } from 'grommet-icons';
import React from 'react';

export enum StatusType {
  Solved = 'solved',
  Unsolved = 'unsolved',
}

export interface StatusProps {
  type: string | StatusType;
  label: string;
}

function getStatusProps(type: string | StatusType) {
  switch (type) {
    case 'solved':
    case StatusType.Solved:
      return { Icon: FormCheckmark, background: 'status-ok' };
    case 'unsolved':
    case StatusType.Unsolved:
      return { Icon: FormClose, background: 'status-unknown' };
    default:
      throw new Error(`Unknown type "${type}" passed to getStatusProps()`);
  }
}

export function Status({ label, type }: StatusProps) {
  const { Icon, background } = getStatusProps(type);

  return (
    <Box direction="row" pad="xxsmall" round="small" background={background}>
      <Icon />
      <Text>{label}</Text>
      &nbsp;
    </Box>
  );
}
