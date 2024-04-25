const mongoose = require('mongoose');
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

export const cropTypeList = async () => {
  const listCrops = (filter = {}) => CropApi.distinctList('cropType', filter);

  const crops = await listCrops({});

  return crops;
};
