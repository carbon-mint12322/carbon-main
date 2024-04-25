import axios from "axios";
import { PlantHealth, PlantHealthResult } from "~/frontendlib/dataModel/plantHealth";

const PLANT_HEALTH_API = 'https://plant.id/api/v3/health_assessment'

const fetchPlantHealthInfo = async (imageRes: string): Promise<PlantHealthResult> => {

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
      details: "local_name,description,url,treatment,classification,common_names,cause"
    }
  }

  const plantHealthData: { data: PlantHealth } = await axios.post(
    PLANT_HEALTH_API,
    data, config
  );

  return plantHealthData.data.result

};


export { fetchPlantHealthInfo }