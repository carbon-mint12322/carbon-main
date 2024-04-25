import React from 'react';
import dynamic from 'next/dynamic';

import { useTheme } from '@mui/material';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DonutProps {
  series?: number[];
  color?: string;
  width?: number | string;
  height?: number | string;
  options?: {
    [key: string]: string | number | boolean | object;
  };
  showDataLabels?: boolean;
  showLegend?: boolean;
  showCount?: boolean;
  labels?: string[];
  size?: string;
}

export default function Donut({
  color,
  options = {},
  series = [0],
  height = 65,
  width = 50,
  showDataLabels = false,
  showLegend = false,
  showCount = false,
  labels = [],
  size = '35%',
  ...props
}: DonutProps) {
  const theme = useTheme();

  const colorData = color
    ? {
        colors: [color, theme.palette.chart.default],
      }
    : {};

  return (
    <Chart
      options={{
        chart: {
          background: 'fff',
          stacked: false,
          toolbar: {
            show: false,
          },
        },

        dataLabels: {
          enabled: showDataLabels,
          style: {
            fontSize: '14px',
            fontFamily: 'stevie-sans',
            fontWeight: 600,
            colors: ['#fff'],
          },
          background: {
            enabled: true,
            foreColor: '#000',
            padding: 7,
            borderWidth: 1,
            borderColor: '#fff',
            opacity: 0.9,
            borderRadius: 10,
            dropShadow: {
              enabled: false,
              top: 100,
              left: 10,
              blur: 1,
              color: '#000',
              opacity: 0.45,
            },
          },
          dropShadow: {
            enabled: false,
            top: 100,
            left: 10,
            blur: 1,
            color: '#000',
            opacity: 0.45,
          },
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 535,
            options: {
              chart: {
                width: 280,
                height: 280,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        legend: {
          show: showLegend,
          fontSize: '15px',
          fontFamily: 'stevie-sans',
          fontWeight: 400,
          formatter: function (seriesName: any, opts: any) {
            return showCount
              ? `${seriesName} - ${opts.w.globals.series[opts.seriesIndex].toFixed(0) || 0}`
              : `${seriesName} - ${opts.w.globals.series[opts.seriesIndex].toFixed(2) || 0} acres`;
          },
          markers: {
            radius: 2,
            width: 15,
            height: 15,
            customHTML: function () {
              return '<span class="custom-marker"><i class="fas fa-chart-pie"></i></span>';
            },
          },
        },
        stroke: {
          width: 0,
        },
        plotOptions: {
          pie: {
            donut: {
              size: size,
            },
          },
        },
        ...colorData,
        ...options,
      }}
      type='donut'
      height={height}
      width={width}
      series={series}
      {...props}
    />
  );
}
