import { Button, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import styles from '~/styles/theme/brands/styles';

export default function BasicDetails() {
  return (
    <Grid container direction='column' flexWrap='nowrap' gap='32px' sx={styles.formFields}>
      <TextField label='Land Parcel Name' />
      <TextField label='Survey Numbers' />
      <TextField label='Number of Acres' />
      <Typography>Address</Typography>
      <TextField label='Village' />
      <Grid container flexWrap='nowrap' gap='32px'>
        <TextField fullWidth label='State' />
        <TextField fullWidth label='Pincode' />
      </Grid>
      <TextField label='Distance From Service Road' />
      <Typography>Neighbours</Typography>
      <Grid container flexWrap='nowrap' gap='32px'>
        <TextField fullWidth label='North' />
        <TextField fullWidth label='South' />
      </Grid>
      <Grid container flexWrap='nowrap' gap='32px'>
        <TextField fullWidth label='East' />
        <TextField fullWidth label='West' />
      </Grid>
    </Grid>
  );
}
