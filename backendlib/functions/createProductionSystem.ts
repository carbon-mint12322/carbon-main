import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../productionsytem/create');

const schemaId = `/farmbook/productionsystem`;
const modelApi = getModel(schemaId);


export const createProductionSystem = async (data: any, userId: string) => {


  let createRequest = data.requestData;
  const parsedData = await uploadFormFile(data.requestData);
  const lpInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'PS'),
  };
  logger.debug('Creating new production system in DB');
  const createResult = await modelApi.create(
    lpInput,
    userId,
  );
  logger.debug('Production System bject created');
  await createPlan(
    createRequest.pop,
    'pop',
    createResult.insertedId.toString(),
    'productionsystem',
    createRequest.plannedSowingDate,
    userId,
    data.collective.slug,
    schemaId,
  );
  return createResult;
};
