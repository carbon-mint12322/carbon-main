import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../cow/create');

const schemaId = `/farmbook/cow`;
const modelApi = getModel(schemaId);

export const createCow = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const cowInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'AC').concat('-').concat(data.requestData.cropType),
  };
  logger.debug('Creating new cow in DB');
  const createResult = await modelApi.create(cowInput, userId);
  logger.debug('Cow object created');

  await createPlan(
    data.requestData.cowPop,
    'cowpop',
    createResult.insertedId.toString(),
    'cow',
    data.requestData.plannedStockingDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};
