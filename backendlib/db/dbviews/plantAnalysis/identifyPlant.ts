import axios from 'axios';
import { PlantIdentificationResult, PlantIdentification } from '~/frontendlib/dataModel/plantIdentification';

const PLANT_IDENTIFY_API = 'https://plant.id/api/v3/identification'

const identifyPlant = async (imageRes: string): Promise<PlantIdentificationResult> => {
  const data = {
    images: [imageRes],
    "similar_images": true
  };

  const config = {
    headers: {
      'Api-Key': process.env.PLANT_ID_KEY || '',
      'Content-Type': 'application/json'
    },
    params: {
      language: 'en',
      details: "common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods"
    }
  }

  const response: { data: PlantIdentification } = await axios.post(PLANT_IDENTIFY_API, data, config);
  return response.data.result

};

export { identifyPlant }