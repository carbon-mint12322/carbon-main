import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../landparcel/update');

const schemaId = `/farmbook/landparcel`;
const modelApi = getModel(schemaId);

export const updateLandParcel = async (id: string, mods: any, userId: string) => {
  const parsedData = await uploadFormFile(mods);
  logger.debug('Updating land parcel in DB');
  const result = (mods.operation && mods.operation === 'add') ? await modelApi.add(id, parsedData, userId) : await modelApi.update(id, parsedData, userId);
  logger.debug('Land Parcel object updated');
  return result;
};
