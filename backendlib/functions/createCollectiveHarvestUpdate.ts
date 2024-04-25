import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../farmer/create');

const schemaId = `/farmbook/collective`;
const modelApi = getModel(schemaId);

export const createCollectiveHarvestUpdate = async (data: any, parentId: string) => {

  const collective = await modelApi.get(parentId);

  if (!collective) {
    throw new Error('No collective found.');
  }

  if (collective.harvestUpdateDetails) {
    collective.harvestUpdateDetails.forEach((hud: any) => {
      if (hud.year === data.ospYear) {
        throw new Error('A harvest update already exists with this OSP year.');
      }
    });
  }

  logger.debug('Creating new harvest update in DB');
  const result = await modelApi.add(
    parentId,
    {
      harvestUpdateDetails: data,
    },
    data.createdBy,
  );
  logger.debug('Harvest UPdate object created');
  return { ...result, upsertedId: data._id };
  
};
