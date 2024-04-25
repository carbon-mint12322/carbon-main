import React from 'react';

import MUiCircularProgress, {
  CircularProgressProps as MUiCircularProgressProps,
} from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

export interface CircularProgressProps extends MUiCircularProgressProps {
  boxSx?: SxProps;
}

export default function CircularProgress({ boxSx = {}, ...props }: CircularProgressProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '30rem',
        ...boxSx,
      }}
    >
      <MUiCircularProgress {...props} />
    </Box>
  );
}
