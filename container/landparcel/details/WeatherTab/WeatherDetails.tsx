import React from "react";
import { Typography, TypographyProps } from '@mui/material';

interface WeatherContainerProps extends TypographyProps {
  weather: string
}

export const WeatherDetails = ({ weather, ...props }: WeatherContainerProps) => {
  return (
    <Typography {...props}>
      {weather}
    </Typography>
  );
}
