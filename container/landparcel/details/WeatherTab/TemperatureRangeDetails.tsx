import React from "react";
import { Typography, TypographyProps } from '@mui/material';

interface TemperatureRangeDetailsProps extends TypographyProps {
  min: number;
  max: number;
}

export const TemperatureRangeDetails = ({ min, max, ...props }: TemperatureRangeDetailsProps) => {
  return (
    <Typography color='primary' {...props}>
      {`H:${Math.round(max)}°C L:${Math.round(min)}°C`}
    </Typography>
  );
}