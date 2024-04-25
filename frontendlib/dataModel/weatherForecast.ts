import { Clouds, Coord, Weather, WeatherMain, Wind } from "./weather";

export interface WeatherForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecastList[];
  city: City;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherForecastList {
  dt: number;
  main: WeatherForecastMain;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: Sys;
  dt_txt: Date;
}

export interface WeatherForecastMain extends WeatherMain {
  sea_level: number;
  grnd_level: number;
  temp_kf: number;
}

export interface Rain {
  "3h": number;
}

export interface Sys {
  pod: string;
}

