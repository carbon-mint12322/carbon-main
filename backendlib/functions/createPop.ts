import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ControlPoint } from '../pop/types';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../pop/create');

const schemaId = `/farmbook/pop`;
const modelApi = getModel(schemaId);

const addIdToControlPoints = (controlPoints: ControlPoint[]) =>
  controlPoints.map((cp: ControlPoint) => {
    return {
      ...cp,
      _id: new ObjectId(),
    };
  });

export const createPop = async (data: any, userId: string) => {
  const parsedData: any = await uploadFormFile(data.requestData);
  const popInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    controlPoints: addIdToControlPoints(parsedData.controlPoints),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'POP'),
  };
  logger.debug('Creating new pop in DB');
  const createResult = await modelApi.create(popInput, userId);
  logger.debug('POP object created');
  return createResult;
};
