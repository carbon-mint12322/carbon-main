import React from 'react';

import MUiCarousel from 'react-material-ui-carousel';
import { Box, Typography, useTheme } from '@mui/material';

interface CarouselProps {
  carousel: Carousel[];
}

interface Carousel {
  mission: string;
  missionDesc: string;
}

export default function Carousell({ carousel }: CarouselProps) {
  const theme = useTheme();

  return (
    <MUiCarousel
      activeIndicatorIconButtonProps={{
        style: {
          color: theme.palette.carouselActiveIndicator.main,
        },
      }}
      indicatorContainerProps={{
        style: {
          marginTop: '50px', // 5
        },
      }}
    >
      {carousel?.map((item: any, i: number) => (
        <React.Fragment key={i}>
          <Box component={Typography} variant={'h2'} color={'common.black'} fontSize={'1rem'}>
            {item.mission}
          </Box>
          <Box component={'p'} color={'common.black'} sx={{ fontSize: '1rem', minHeight: '150px' }}>
            {item?.missionDesc}
          </Box>
        </React.Fragment>
      ))}
    </MUiCarousel>
  );
}
