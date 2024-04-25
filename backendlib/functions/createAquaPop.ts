import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ControlPoint } from '../pop/types';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../aquapop/create');

const schemaId = `/farmbook/aquapop`;
const modelApi = getModel(schemaId);

const addIdToControlPoints = (controlPoints: ControlPoint[]) =>
  controlPoints.map((cp: ControlPoint) => {
    return {
      ...cp,
      _id: new ObjectId(),
    };
  });

export const createAquaPop = async (data: any, userId: string) => {
  const parsedData: any = await uploadFormFile(data.requestData);
  const popInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    controlPoints: addIdToControlPoints(parsedData.controlPoints),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'AquaPOP'),
  };
  logger.debug('Creating new aquaculture pop in DB');
  const createResult = await modelApi.create(popInput, userId);
  logger.debug('Aquaculture POP object created');
  return createResult;
};
