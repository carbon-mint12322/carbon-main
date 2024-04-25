import { KeyboardArrowDown } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React from 'react';

export default function DropDowns() {
  return (
    <Grid container direction='row' flexWrap='nowrap' columnGap='32px'>
      <Grid container direction='row' width='fit-content' flexWrap='nowrap'>
        <Typography>Location</Typography>
        <KeyboardArrowDown />
      </Grid>
      <Grid container direction='row' width='fit-content' flexWrap='nowrap'>
        <Typography>Ownership Status</Typography>
        <KeyboardArrowDown />
      </Grid>
      <Grid container direction='row' width='fit-content' flexWrap='nowrap'>
        <Typography>Crop</Typography>
        <KeyboardArrowDown />
      </Grid>
      <Grid container direction='row' width='fit-content' flexWrap='nowrap'>
        <Typography>No. of Crops</Typography>
        <KeyboardArrowDown />
      </Grid>
      <Grid container direction='row' width='fit-content' flexWrap='nowrap'>
        <Typography>Size</Typography>
        <KeyboardArrowDown />
      </Grid>
    </Grid>
  );
}
