import React from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BarProps {
  series?: Series[];
  colors?: string[];
  width?: number | string;
  height?: number | string;
  options?: {
    [key: string]: string | number | boolean | object;
  };
}

interface Series {
  name: string;
  data: number[];
}

export default function Bar({
  colors = ['#F79023'],
  options,
  series = [
    {
      name: 'X',
      data: [0],
    },
  ],
  ...props
}: BarProps) {
  return (
    <Chart
      height={300}
      type='bar'
      options={{
        chart: {
          type: 'bar',
          height: 380,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          colors: colors,
        },
        ...options,
      }}
      series={series}
      {...props}
    />
  );
}
