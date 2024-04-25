import MongoAdapter from '../../MongoAdapter';
import { model2schemaId } from '../util';

const AQUACROP_SCHEMA_ID = model2schemaId('aquacrop');
const AquaCropApi = MongoAdapter.getModel(AQUACROP_SCHEMA_ID);

export const aquacropNameList = async () => {
  const listAquaCrops = (filter = {}) => AquaCropApi.distinctList('cropType', filter);

  const aquacrops = await listAquaCrops({});

  return aquacrops;
};
