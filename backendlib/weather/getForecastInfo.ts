import axios from 'axios';
import { WeatherForecastData } from '~/frontendlib/dataModel/weatherForecast';


export const permittedRoles = ['FARMER', 'VIEWER'];

const OPEN_WEATHER_API_URL: string = 'https://api.openweathermap.org/data/2.5/forecast';

export const getForecastInfo = async (lat: number, lon: number): Promise<WeatherForecastData> => {
  try {
    const response = await axios.get(OPEN_WEATHER_API_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: process.env.OPEN_WEATHER_KEY,
        cnt: 5
      },
    });


    return response.data
  } catch (error) {
    console.error('Error fetching weather information:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};