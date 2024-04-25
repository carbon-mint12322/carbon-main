import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ControlPoint } from '../pop/types';
import { ObjectId } from 'mongodb';
import { uploadFormFile } from '../upload/file';

const logger = makeLogger('/api/.../pop/update');

const schemaId = `/farmbook/pop`;
const modelApi = getModel(schemaId);

const addIdToControlPoints = (controlPoints: ControlPoint[]) =>
  controlPoints?.map((cp: ControlPoint) => {
    return {
      ...cp,
      _id: new ObjectId(),
    };
  });



export const updatePop = async (id: string, mods: any, userId: string) => {
  const popInput = {
    ...JSON.parse(JSON.stringify(mods)),
  };
  if (mods.controlPoints) {
    popInput.controlPoints = addIdToControlPoints(mods.controlPoints)
  } 
  const parsedData = await uploadFormFile(popInput);
  const updateResult = await modelApi.update(id, parsedData, userId);
  logger.debug('POP object updated');
  return updateResult;
};
