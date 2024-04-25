import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectID } from 'mongodb';

const logger = makeLogger('/api/.../croppingsystem/create');

const schemaId = `/farmbook/croppingsystem`;
const modelApi = getModel(schemaId);
const fieldSchema = '/farmbook/field';
const FieldApi = getModel(fieldSchema);

export const createCroppingSystem = async (data: any, userId: string) => {
    const croppingSystem = await modelApi.getByFilter(
      {
        $and: [{ field: data.requestData.field }, { status: { $ne: 'Completed' } }],
      },
      { _id: 1, name: 1 },
    );
    if (croppingSystem) {
        throw new Error(
            'There is an active cropping system for the selected field parcel. Please select a different field parcel.'
        ); 
    }
    const field = await FieldApi.getByFilter(
      { _id: new ObjectID(data.requestData.field) },
      { fieldType: 1 },
    );
    const cs = await modelApi.getByFilter(
      { field: data.requestData.field },
      { status: 1, active: 1 },
    );
    if (cs && cs.active && cs.status !== 'Completed') {
        throw new Error(
          'The field selected has an active cropping system, please select a different field.'
        );
    }
    if (field.fieldType) {
        if (field.fieldType !== 'Open Field') {
        throw new Error(
          `Please select a field that is of type 'Open Field' to add a new cropping system.`
        );
        }
    }
  const parsedData = await uploadFormFile(data.requestData);
  const csInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    status: 'Draft',
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'CS'),
  };
  logger.debug('Creating new cropping system in DB');
  const createResult = await modelApi.create(csInput, userId);
  logger.debug('Cropping system object created');
  return createResult;
};
