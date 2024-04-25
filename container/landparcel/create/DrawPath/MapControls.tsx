import React from 'react';

import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { useDrawPathContext } from './context';

export default function MapControls({ handleButtonClick }: any) {
  const {
    // handleButtonClick,
    captureOn,
    resetState,
  } = useDrawPathContext();
  console.log('🚀 ~ file: MapControls.tsx:9 ~ MapControls ~ captureOn', handleButtonClick);

  return (
    <Stack direction='row' spacing={1} paddingBottom='30px'>
      <Button
        color='primary'
        variant='contained'
        onClick={() => {
          handleButtonClick('outerBoundary');
          console.log('🚀 ~ file: MapControls.tsx:18 ~ MapControls ~ handleButtonClick');
        }}
        disabled={captureOn?.outerBoundaryCompleted}
        sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        {!captureOn?.outerBoundary ? 'Start outer Boundaries' : 'Stop outer Boundaries'}
      </Button>
      <Button
        color='primary'
        variant='contained'
        onClick={() => handleButtonClick('innerBoundary')}
        disabled={!captureOn?.outerBoundaryCompleted}
        sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        {!captureOn?.innerBoundary ? 'Start inner Boundaries' : 'Stop inner Boundaries'}
      </Button>

      <Button
        color='primary'
        variant='contained'
        onClick={resetState}
        sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        Reset
      </Button>
      <Button
        color='primary'
        variant='contained'
        // onClick={onSave}
        sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        Save
      </Button>
      <Button
        color='primary'
        variant='contained'
        // onClick={onCancel}
        sx={{ bgcolor: 'primary', '&:hover': { bgcolor: 'primary.dark' } }}
      >
        Cancel
      </Button>
    </Stack>
  );
}
