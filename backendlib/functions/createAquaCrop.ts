import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../aquacrop/create');

const schemaId = `/farmbook/aquacrop`;
const modelApi = getModel(schemaId);

export const createAquaCrop = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const aquacropInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'AC').concat('-').concat(data.requestData.cropType),
  };
  logger.debug('Creating new aquaculture crop in DB');
  const createResult = await modelApi.create(aquacropInput, userId);
  logger.debug('Aquaculture crop object created');

  await createPlan(
    data.requestData.aquaPop,
    'aquapop',
    createResult.insertedId.toString(),
    'aqua',
    data.requestData.plannedStockingDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
