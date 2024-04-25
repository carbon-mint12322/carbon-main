import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../goat/create');

const schemaId = `/farmbook/goat`;
const modelApi = getModel(schemaId);

export const createGoat = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const goatInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'AC').concat('-').concat(data.requestData.cropType),
  };
  logger.debug('Creating new goat in DB');
  const createResult = await modelApi.create(goatInput, userId);
  logger.debug('Goat object created');

  await createPlan(
    data.requestData.goatPop,
    'goatpop',
    createResult.insertedId.toString(),
    'goat',
    data.requestData.plannedStockingDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
