import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../farmer/update');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);


export const deleteFarmer = async (id: string, userId: string) => {
  logger.debug('Deleting farmer/processor in DB');
  const farmer = await modelApi.get(id);
  const result = await modelApi.remove(id);
  await userModelApi.remove(farmer.userId);
  logger.debug('Farmer/Processor object deleted');
  return result;
};
