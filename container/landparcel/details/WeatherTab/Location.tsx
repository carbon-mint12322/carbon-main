import React from "react";
import { Typography, TypographyProps } from '@mui/material';

interface LocationProps extends TypographyProps {
  location: string
  country: string
}

export const Location = ({ location, country, ...props }: LocationProps) => {

  return (
    <Typography variant="h6" {...props}>
      {location}, {country}
    </Typography>
  );
}

