import { Divider, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { Leaf } from '~/components/Icons';
import { ColouredGrid } from './LandParcelListCard';

export default function MapOverlay(props: { data: any }) {
  const { data } = props;

  return (
    <Grid
      component={Paper}
      bgcolor='white'
      height='fit-content'
      width='100%'
      // position='absolute'
      // bottom='33px'
      borderRadius='0px'
      p='16px'
      rowGap='12px'
      container
      direction='column'
      flexWrap='nowrap'
    >
      <Grid container flexWrap='nowrap' columnGap='16px'>
        <Grid bgcolor='white.light' borderRadius='24px' width='fit-content' px='6px'>
          <Typography fontSize='14px' fontWeight='600'>
            Name: {data?.name}
          </Typography>
        </Grid>
        <Grid bgcolor='white.light' borderRadius='24px' width='fit-content' px='6px'>
          <Typography fontSize='14px' fontWeight='600'>
            Sy. {data?.surveyNumber}
          </Typography>
        </Grid>
        <Grid bgcolor='white.light' borderRadius='24px' width='fit-content' px='6px'>
          <Typography fontSize='14px' fontWeight='600'>
            {data?.areaInAcres}Acres
          </Typography>
        </Grid>
        <Grid bgcolor='white.light' borderRadius='24px' width='fit-content' px='6px'>
          <Typography fontSize='14px' fontWeight='600' color='editColor.contrastText'>
            {data?.own == 'No' ? 'Leased' : 'Own'}
          </Typography>
        </Grid>
      </Grid>

      {data?.crops?.length > 0 && (
        <Grid container flexWrap='nowrap' columnGap='8px' alignItems='center'>
          <ColouredGrid>
            <Leaf height='10px' width='10px' color='iconColor.default' />
            <Typography fontSize='14px' fontWeight='550' color='primary'>
              {data?.crops?.[0]?.name}
            </Typography>
          </ColouredGrid>
          {data?.crops?.length > 1 && (
            <ColouredGrid>
              <Leaf height='10px' width='10px' color='iconColor.default' />
              <Typography fontSize='14px' fontWeight='550' color='primary'>
                {data?.crops?.[1]?.name}
              </Typography>
            </ColouredGrid>
          )}
          {data?.crops?.length - 2 > 0 && (
            <ColouredGrid>
              <Typography fontSize='14px' fontWeight='550' color='primary'>
                +{data?.crops?.length - 2}
              </Typography>
            </ColouredGrid>
          )}
        </Grid>
      )}
    </Grid>
  );
}
