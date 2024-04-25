import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../sheep/create');

const schemaId = `/farmbook/sheep`;
const modelApi = getModel(schemaId);

export const createSheep = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const sheepInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'AC').concat('-').concat(data.requestData.cropType),
  };
  logger.debug('Creating new cow in DB');
  const createResult = await modelApi.create(sheepInput, userId);
  logger.debug('Sheep object created');

  await createPlan(
    data.requestData.sheepPop,
    'sheeppop',
    createResult.insertedId.toString(),
    'sheep',
    data.requestData.plannedStockingDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
