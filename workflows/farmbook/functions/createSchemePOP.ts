import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';
import makeLogger from '../../../backendlib/logger';
import { getModel } from '../../../backendlib/db/adapter';
import { CompliancePoint } from '../../../backendlib/pop/types';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../schemepop/create');

const schemaId = `/farmbook/schemepop`;
const modelApi = getModel(schemaId);

const addIdToCompliancePoints = (compliancePoints: CompliancePoint[]) =>
  compliancePoints.map((cp: CompliancePoint) => {
    return {
      ...cp,
      _id: new ObjectId(),
    };
  });

export const createSchemePOP = async (data: any, userId: string) => {

  const currentschemepop = await modelApi.getByFilter({
    schemeName: data.requestData.schemeName,
    responsibleParty: data.requestData.responsibleParty
  });

  if (currentschemepop) {
    throw new Error(
      'POP for this scheme and responsible party already exists'
    );
  }

  console.log("Creating Scheme POP");
  const parsedData: any = await uploadFormFile(data.requestData);
  delete parsedData.name;
  const popInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    compliancePoints: addIdToCompliancePoints(parsedData.compliancePoints),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'Scheme POP'),
    status: 'Draft',
  };
  logger.debug('Creating new scheme pop in DB');
  const createResult = await modelApi.create(popInput, userId);
  logger.debug('Scheme POP object created');
  return createResult;
};
