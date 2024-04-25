import { Circle } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React, { ReactNode } from 'react';

const MapMarkerToolTip = ({
  markerData: {
    data: { name, areaInAcres },
  },
}: any) => {
  return (
    <Grid container direction='column' flexWrap='nowrap' gap={1}>
      <Typography>{name}</Typography>
      <Grid container flexWrap='nowrap' alignItems='center' gap='4px'>
        Area: {areaInAcres} Acres
      </Grid>
    </Grid>
  );
};

export default MapMarkerToolTip;
