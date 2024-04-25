import MongoAdapter from '../../MongoAdapter';
import { model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('poultrybatches');
const PoultryApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const poultryBreedNameList = async () => {
  const listPoultryBreeds = (filter = {}) => PoultryApi.distinctList('poultryBatch.breed', filter);

  const poultryBreeds = await listPoultryBreeds({});

  return poultryBreeds;
};
