import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectID } from 'mongodb';

const logger = makeLogger('/api/.../plot/create');

const schemaId = `/farmbook/plot`;
const modelApi = getModel(schemaId);
const fieldSchema = '/farmbook/field';
const FieldApi = getModel(fieldSchema);

export const createPlot = async (data: any, userId: string) => {

    const field = await FieldApi.getByFilter(
      { _id: new ObjectID(data.requestData.field) },
      { fieldType: 1 },
    );
    if (!field.fieldType || field.fieldType === 'Open Field') {
        throw new Error(
          `Please select a field that is not an 'Open Field' to add a new plot.`
        ); 
    }

  const parsedData = await uploadFormFile(data.requestData);
  const lpInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    status: 'Draft',
    fbId: generateLocalId(data.collective.name, 'PL'),
  };
  logger.debug('Creating new plot in DB');
  const createResult = await modelApi.create(lpInput, userId);
  logger.debug('Plot object created');
  return createResult;
};
