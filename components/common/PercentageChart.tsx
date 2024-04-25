import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-apexcharts';
import { Box, Grid, useTheme } from '@mui/material';
import { Leaf } from '../Icons';
import { Color } from '~/frontendlib/types';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IProps extends Props {
  colors?: Color[];
  icon?: ReactElement;
}

export default function PercentageChart(props: IProps) {
  const theme = useTheme();
  const {
    icon,
    colors = [theme.palette.chart.primary, theme.palette.chart.default],
    ...chartProps
  } = props;
  return (
    <Box position='relative' display='flex' alignItems='center' justifyContent='center'>
      {icon && (
        <Box position='absolute' ml='2px' mt='2px' zIndex={10}>
          {icon}
        </Box>
      )}
      <Chart
        type='donut'
        {...chartProps}
        options={{
          chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
              show: false,
            },
          },
          colors,
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          stroke: {
            width: 0,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
                labels: {
                  show: true,
                },
              },
            },
          },
          ...chartProps.options,
        }}
      />
    </Box>
  );
}
