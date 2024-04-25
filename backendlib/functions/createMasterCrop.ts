import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../mastercrop/create');

const schemaId = `/farmbook/mastercrop`;
const modelApi = getModel(schemaId);

const collectiveSchemaId = `/farmbook/collective`;
const collectiveModelApi = getModel(collectiveSchemaId);

export const createMasterCrop = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const crop = await modelApi.getByFilter({
    cropName: data.requestData.cropName,
    collective: data.requestData.collective,
    active: true
  });

  if (crop) {
    throw new Error('A master crop already exists for this crop.');
  }

  const operator = await collectiveModelApi.get(data.requestData.collective);

  const mcInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    fbId: generateLocalId(operator.name, 'MC'),
  };
  logger.debug('Creating new master crop in DB');
  const createResult = await modelApi.create(mcInput, userId);
  logger.debug('Master Crop object created');
  return createResult;
};
