import { Grid } from '@mui/material';
import React from 'react';
import { DownArrow } from '../Icons';
import { Color } from '~/frontendlib/types';

type Level = {
  width: number;
  color: Color;
};

type LevelIndicatorProps = {
  levels: Level[];
  value: number;
};

export default function LevelIndicator(props: LevelIndicatorProps) {
  const { levels, value } = props;
  return (
    <Grid
      mt='20px'
      width='100%'
      height='12px'
      borderRadius='10px'
      bgcolor='black'
      container
      flexWrap='nowrap'
      position='relative'
      justifyContent='flex-start'
    >
      <Grid position='absolute' bottom='8px' left={`calc(${value}% - 11px)`}>
        <DownArrow height='12px' width='22px' color='black' />
      </Grid>
      {levels?.map?.((level, index) => (
        <Grid
          key={index}
          borderRadius={
            index == 0
              ? '10px 0px 0px 10px'
              : index == levels.length - 1
              ? '0px 10px 10px 0px'
              : '0px'
          }
          width={`${level.width}%`}
          height='100%'
          bgcolor={level.color}
        />
      ))}
    </Grid>
  );
}
