import React from 'react';

import { Button, Grid, Paper, Typography, useTheme } from '@mui/material';

import Donut from '~/components/common/Chart/Donut';

interface IProps {
  progress: number;
  nextStep: string;
  total: number;
  onClick: () => void;
}
export default function LandParcelProgress(props: IProps) {
  const theme = useTheme();
  const { progress = 0, nextStep = 'Next', total = 100, onClick } = props;
  return (
    <Grid
      component={Paper}
      container
      height='88px'
      justifyContent='space-between'
      flexWrap='nowrap'
      alignItems='center'
      px={5}
    >
      <Grid container alignItems='center' flexWrap='nowrap' gap={3}>
        <Donut
          series={[progress, total - progress]}
          height={75}
          color={theme.palette.chart.primary}
        />
        <Grid container direction='column' flexWrap='nowrap'>
          <Typography>Land Parcel Progress</Typography>
          <Typography>
            STEP {progress} OF {total} COMPLETED
          </Typography>
        </Grid>
      </Grid>
      {nextStep && (
        <Grid container justifyContent='flex-end'>
          <Button variant='contained' onClick={onClick}>
            {nextStep}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
