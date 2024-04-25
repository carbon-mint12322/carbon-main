import MongoAdapter from '../../MongoAdapter';
import { model2schemaId } from '../util';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

export const cropNameList = async () => {
  const listCrops = (filter = {}) => CropApi.distinctList('name', filter);

  const crops = await listCrops({});

  return crops;
};
