import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ControlPoint } from '../pop/types';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../poultrypop/create');

const schemaId = `/farmbook/poultrypop`;
const modelApi = getModel(schemaId);

const addIdToControlPoints = (controlPoints: ControlPoint[]) =>
  controlPoints.map((cp: ControlPoint) => {
    return {
      ...cp,
      _id: new ObjectId(),
    };
  });

export const createPoultryPop = async (data: any, userId: string) => {
  const parsedData: any = await uploadFormFile(data.requestData);
  const popInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    controlPoints: addIdToControlPoints(parsedData.controlPoints),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'PoultryPOP'),
  };
  logger.debug('Creating new poultry pop in DB');
  const createResult = await modelApi.create(popInput, userId);
  logger.debug('Poultry POP object created');
  return createResult;
};
