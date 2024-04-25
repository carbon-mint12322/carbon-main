import React from "react";
import { Location } from "./Location";
import { TemperatureDetails } from "./TemperatureDetails";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherData } from "~/frontendlib/dataModel/weather";
import { Stack, Typography } from "@mui/material";
import { TemperatureRangeDetails } from "./TemperatureRangeDetails";
import { WeatherConditions } from "./WeatherConditions";
import dayjs from "dayjs";

interface TodaysWeatherCardProps {
  weather: WeatherData
}

export const TodaysWeatherCard = ({ weather }: TodaysWeatherCardProps) => {
  return (
    <Stack direction="row" gap={2} justifyContent="space-between">
      <Stack justifyContent="center" alignItems="flex-start">
        <Typography color='primary' variant="caption">
          {dayjs().format('ddd, MMM D')}
        </Typography>

        <Location
          country={weather.sys.country}
          location={weather.name}
        />

        <TemperatureDetails temp={weather.main.feels_like} />
      </Stack>

      <Stack justifyContent="center" alignItems="flex-end">
        <WeatherConditions icon={weather.weather[0].icon} />

        <WeatherDetails weather={weather.weather[0].main} />

        <TemperatureRangeDetails min={weather.main.temp_min} max={weather.main.temp_max} />
      </Stack>
    </Stack>
  );
}
