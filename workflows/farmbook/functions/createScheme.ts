import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';
import makeLogger from '../../../backendlib/logger';
import { getModel } from '../../../backendlib/db/adapter';
import { CompliancePoint } from '../../../backendlib/pop/types';
import { ObjectId } from 'mongodb';
import { createPlan } from '../../../backendlib/functions/createPlan';

const logger = makeLogger('/api/.../schemepop/create');

const schemaId = `/farmbook/scheme`;
const modelApi = getModel(schemaId);

const schemePopSchema = '/farmbook/schemepop';
const SchemePopApi = getModel(schemePopSchema);


const createScheme = async (data: any, userId: string) => {

  let createRequest = data.requestData;

  // Check to ensure we dont have existing scheme same as current one for this entity

  const currentscheme = await modelApi.getByFilter({
    scheme: createRequest.scheme,
    schemeOwner: data.requestData.schemeOwner
  });

  if (currentscheme) {
    throw new Error(
      'Scheme with current scheme type already exists for this entity'
    );
  }

  const schemePop = await SchemePopApi.getByFilter({
    schemeName: createRequest.scheme,
  });

  const parsedData: any = await uploadFormFile(data.requestData);
  delete parsedData.name;
  const schemeInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'Scheme'),
    status: 'Draft',
  };
  logger.debug('Creating new scheme in DB');
  const createResult = await modelApi.create(schemeInput, userId);
  logger.debug('Scheme object created');

  await createPlan(
    schemePop?._id?.toString(),
    'schemepop',
    createResult.insertedId.toString(),
    'scheme',
    createRequest.registrationDate,
    userId,
    data.collective.slug,
    schemaId,
  );

  return createResult;
};

export default createScheme;
