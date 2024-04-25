import React from 'react';

import { CircularProgress } from './Feedback/Progress';
import { SxProps } from '@mui/material';

export interface CircularLoaderProps {
  value?: boolean;
  children: JSX.Element | React.ReactNode;
  sx?: SxProps;
}

const CircularLoader = ({ value = false, children, sx = {} }: CircularLoaderProps) => {
  if (value) {
    return <CircularProgress boxSx={sx} />;
  }
  return <>{children}</>;
};

export default CircularLoader;
