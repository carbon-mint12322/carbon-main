import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../organicsystemplan/create');

const schemaId = `/farmbook/organicsystemplan`;
const modelApi = getModel(schemaId);

const collectiveSchemaId = `/farmbook/collective`;
const collectiveModelApi = getModel(collectiveSchemaId);

export const createOrganicSystemPlan = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);

  const osp = await modelApi.getByFilter({
    ospYear: data.requestData.ospYear,
    collective: data.requestData.collective,
  });

  if (osp) {
    throw new Error('A consolidated OSP already exists with this OSP year.');
  }

  const operator = await collectiveModelApi.get(data.requestData.collective);

  const cdInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    fbId: generateLocalId(operator.name, 'OS'),
  };
  logger.debug('Creating new consolidated osp in DB');
  const createResult = await modelApi.create(cdInput, userId);
  logger.debug('Consolidated OSP object created');
  return createResult;
};
