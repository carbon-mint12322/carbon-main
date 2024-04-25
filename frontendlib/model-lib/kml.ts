import axios from 'axios';
import { useUser } from '~/contexts/AuthDialogContext';

const fetchMapKml = (modelName: string) => async (id: string) => {
  const apiEndpt = `/api/farmbook/${modelName}/${id}/kml`;
  const { token } = useUser();

  if (!token) {
    throw new Error('Please login');
  }

  const headers = { Authorization: `bearer ${token}` };

  const httpRes = await axios.get(apiEndpt, { headers });
  return httpRes.data;
};

export const makeKmlLink = (modelName: string) => (id: string, token: string) =>
  `/api/farmbook/${modelName}/${id}/kml?userToken=${token}`;

export default fetchMapKml;
