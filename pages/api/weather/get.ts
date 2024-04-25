import { NextApiRequest, NextApiResponse } from 'next';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withDebug from '~/backendlib/middleware/with-debug';
import { getWeatherInfo } from '~/backendlib/weather/getWeatherInfo';
import { getForecastInfo } from '~/backendlib/weather/getForecastInfo';


const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'application/json');
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Convert lat and lng to numbers
  const latitude: number = +lat;
  const longitude: number = +lng;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }


  try {
    const weather = await getWeatherInfo(latitude, longitude);
    const forecast = await getForecastInfo(latitude, longitude);

    res.status(200).json({
      weather,
      forecast
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};


// Wrap in post-handler, which permits http posts only
export default withDebug(httpGetHandler(handler));