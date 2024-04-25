import React from "react";
import { Typography, TypographyProps } from '@mui/material';

interface TemperatureDetailsProps extends TypographyProps {
  temp: number
}

export const TemperatureDetails = ({ temp, ...props }: TemperatureDetailsProps) => {
  return (
    <Typography variant="h5" {...props}>
      {Math.round(temp)}°C
    </Typography>
  );
}