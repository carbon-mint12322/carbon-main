import { fetchPlantHealthInfo } from '~/backendlib/db/dbviews/plantAnalysis/fetchPlantHealthInfo';
import { identifyPlant } from '~/backendlib/db/dbviews/plantAnalysis/identifyPlant';
import { getModel } from '../db/adapter';

const imageToBase64 = require("image-to-base64");

const schemaId = `/farmbook/event`;
const modelApi = getModel(schemaId);

export const getPlantHealth = async (data: any, userId: string) => {
  const { requestData: { eventId, img } } = data
  const event = await modelApi.get(eventId)

  const filename: string = img.substring(img.lastIndexOf('/') + 1);

  const eventCropHealth = event?.cropHealth?.filter((item: any) => item.filename === filename)

  if (eventCropHealth?.length > 0) {
    return eventCropHealth[0]
  }

  const base64Image = await imageToBase64(img);
  const plantInfo = await identifyPlant(base64Image)
  if (plantInfo.is_plant.probability > 0.3) {
    const plantHealthInfo = await fetchPlantHealthInfo(base64Image);
    const plantHealthy = plantHealthInfo?.is_healthy?.probability > 0.3

    const cropHealthInfo = {
      name: plantInfo.classification.suggestions?.[0].name,
      scientificName: plantInfo.classification.suggestions?.[0].details.common_names,
      healthy: plantHealthy,
      disease: plantHealthy ? null : plantHealthInfo?.disease.suggestions.map((item) => ({
        disease: item.name,
        treatment: item.details.treatment.biological
      })),
      filename: filename
    }
    const updateInnerHandler = await modelApi.update(eventId, { cropHealth: [...(event.cropHealth || []), cropHealthInfo] }, userId)
    return cropHealthInfo
  }

  const cropHealthInfo = {
    message: 'Unable to detect crop, please try with a better picture where the crop is clearly visible.',
    filename: filename
  }

  const updateInnerHandler = await modelApi.update(eventId, { cropHealth: [...(event.cropHealth || []), cropHealthInfo] }, userId)
  return cropHealthInfo;
};
