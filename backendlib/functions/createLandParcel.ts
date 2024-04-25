import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';

const logger = makeLogger('/api/.../landparcel/create');

const schemaId = `/farmbook/landparcel`;
const modelApi = getModel(schemaId);


export const createLandParcel = async (data: any, userId: string) => {
  let createRequest = data.requestData;
  const parsedData = await uploadFormFile(data.requestData);
  const lpInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'LP'),
  };
  logger.debug('Creating new land parcel in DB');
  const createResult = await modelApi.create(
    lpInput,
    userId,
  );
  logger.debug('Land Parcel object created');

  await createPlan(
    createRequest.pop,
    'pop',
    createResult.insertedId.toString(),
    'landparcel',
    createRequest.plannedSowingDate,
    userId,
    data.collective.slug,
    schemaId,
  );
  return createResult;
};
