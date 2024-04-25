import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../poultrybatch/create');

const schemaId = `/farmbook/poultrybatch`;
const modelApi = getModel(schemaId);

export const createPoultryBatch = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const poultryInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'PB')
      .concat('-')
      .concat(data.requestData.batchIdName),
  };
  logger.debug('Creating new poultry batch in DB');
  const createResult = await modelApi.create(poultryInput, userId);
  logger.debug('Poultry Batch object created');

  await createPlan(
    data.requestData.poultryPop,
    'poultrypop',
    createResult.insertedId.toString(),
    'poultry',
    data.requestData.chickPlacementDay,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
