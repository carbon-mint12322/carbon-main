import React from 'react';
import { LatLngLiteral } from 'spherical-geometry-js';
import { TodaysWeatherCard } from './TodaysWeatherCard';
import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '~/frontendlib/dataModel/weather';
import axios from 'axios';
import { Box, Card, CircularProgress, Stack, Typography } from '@mui/material';
import { ForeCastWeatherCard } from './ForeCastWeatherCard';
import { WeatherForecastData } from '~/frontendlib/dataModel/weatherForecast';
import CircularLoader from '~/components/common/CircularLoader';

interface WeatherReportProps {
  latLng: LatLngLiteral;
}

export const WeatherReport = ({ latLng }: WeatherReportProps) => {
  const { data, isLoading } = useQuery(['weather'], () => fetchWeatherData(latLng));

  return (
    <CircularLoader value={isLoading}>
      {data && (<Box p={2}>
        <Card sx={{ p: 2 }} elevation={2}>
          <Stack gap={2}>
            <Stack gap={2}>
              {data?.weather && <TodaysWeatherCard weather={data?.weather} />}

              <Stack direction='row' gap={1} width={'100%'}>
                {data?.forecast?.list?.map((item, index) => {
                  return <ForeCastWeatherCard forecast={item} key={index} />;
                })}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Box>)}
    </CircularLoader>
  );

};

interface WeatherApiResponse {
  weather: WeatherData;
  forecast?: WeatherForecastData;
}

export const fetchWeatherData = async ({
  lat,
  lng,
}: LatLngLiteral): Promise<WeatherApiResponse> => {
  const apiUrl = `/api/weather`;
  try {
    const response = await axios.get(apiUrl, {
      params: {
        lat,
        lng,
      },
    });
    return response.data;
  } catch (error) {
    console.log('🚀 ~ file: WeatherReport.tsx:44 ~ fetchWeatherData ~ error:', error);

    throw error;
  }
};
