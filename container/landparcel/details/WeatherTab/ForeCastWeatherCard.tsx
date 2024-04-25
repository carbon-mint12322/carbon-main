import React from 'react';
import { Card, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { TemperatureRangeDetails } from './TemperatureRangeDetails';
import { WeatherDetails } from './WeatherDetails';
import { WeatherForecastList } from '~/frontendlib/dataModel/weatherForecast';
import { TemperatureDetails } from './TemperatureDetails';
import { WeatherConditions } from './WeatherConditions';


interface ForeCastWeatherCardProps {
  forecast: WeatherForecastList
}


export const ForeCastWeatherCard = ({ forecast }: ForeCastWeatherCardProps) => {

  return (
    <Card sx={{
      width: "100%",
      px: 2,
      py: 1
    }}
      elevation={2}
    >

      <Stack justifyContent="space-between" alignItems="center">
        <Typography variant="caption">
          {dayjs.unix(forecast.dt).format('hh:mm A')}
        </Typography>

        <TemperatureDetails temp={forecast.main.feels_like} variant="caption" />
        <WeatherConditions icon={forecast.weather[0].icon} variant="h5" />
        <WeatherDetails weather={forecast.weather[0].main} variant="caption" />
      </Stack>
    </Card>
  );
}
