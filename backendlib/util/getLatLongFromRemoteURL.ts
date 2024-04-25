const axios = require('axios');

export async function getLatLongFromRemoteURL(
  url: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await axios.get(url);

    const lat = response.headers['x-image-meta-property-location-lat'];
    const lng = response.headers['x-image-meta-property-location-lng'];

    if (lat && lng) {
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      console.error('Latitude and longitude not found in response headers.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
