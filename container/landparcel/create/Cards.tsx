import { Card, Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React from 'react';
interface IProps {
  values: { field: string; value: string }[];
}
export function DataCard(props: IProps) {
  return (
    <Grid component={Card} p='24px' container gap='12px'>
      {props.values.map(({ field, value }, index) => (
        <Grid container direction='column' width='40%' key={index}>
          <Typography variant='caption'>{field.toLocaleUpperCase()}</Typography>
          <Typography>{_.isObject(value) ? Object.values(value).join(', ') : value}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
export function BasicUtilitiesDataCard(props: {
  values: {
    waterResources: { field: string; value: string }[];
    powerResources: { field: string; value: string }[];
  };
}) {
  return (
    <Grid component={Card} p='24px' container gap='12px' direction='column'>
      <Typography>Water Resources</Typography>
      <Grid container gap='12px'>
        {props.values?.waterResources?.map?.(({ field, value }, index) => (
          <Grid container direction='column' width='40%' key={index}>
            <Typography variant='caption'>{field.toLocaleUpperCase()}</Typography>
            <Typography>{_.isObject(value) ? Object.values(value).join(', ') : value}</Typography>
          </Grid>
        ))}
      </Grid>
      <Typography>Power Resources</Typography>
      <Grid container gap='12px'>
        {props.values?.powerResources?.map?.(({ field, value }, index) => (
          <Grid container direction='column' width='40%' key={index}>
            <Typography variant='caption'>{field.toLocaleUpperCase()}</Typography>
            <Typography>{_.isObject(value) ? Object.values(value).join(', ') : value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
