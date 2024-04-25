import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../field/create');

const schemaId = `/farmbook/field`;
const modelApi = getModel(schemaId);
const landParcelSchema = '/farmbook/landparcel';
const LandParcelApi = getModel(landParcelSchema);

export const createField = async (data: any, userId: string) => {

    if (data.requestData.landParcelMap === true) {
    const landparcel = await LandParcelApi.getByFilter({
        _id: new ObjectId(data?.requestData.landParcel),
    });
    if (landparcel && landparcel.map) {
        data.requestData.map = landparcel.map;
        data.requestData.location = landparcel.location;
        data.requestData.calculatedAreaInAcres = landparcel.calculatedAreaInAcres;
    }
    }

  const parsedData = await uploadFormFile(data.requestData);
  const fpInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'FP'),
  };
  logger.debug('Creating new field parrcel in DB');
  const createResult = await modelApi.create(fpInput, userId);
  logger.debug('Field Parcel object created');
  return createResult;
};
