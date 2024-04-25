import axios from 'axios';
import { WeatherData } from '~/frontendlib/dataModel/weather';


export const permittedRoles = ['FARMER', 'VIEWER'];

const OPEN_WEATHER_API_URL: string = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherInfo = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(OPEN_WEATHER_API_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: process.env.OPEN_WEATHER_KEY,
      },
    });


    return response.data
  } catch (error) {
    console.error('Error fetching weather information:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
};