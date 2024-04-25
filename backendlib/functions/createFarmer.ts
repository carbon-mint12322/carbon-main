import { generateLocalId } from "../db/util";
import { uploadFormFile } from "../upload/file";
import makeLogger from '../logger';
import { getModel } from "../db/adapter";

const logger = makeLogger('/api/.../farmer/create');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);

export const createFarmer = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);
  const farmerInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collectives: [data.collective.id],
    fbId: generateLocalId(data.collective.name, 'FR'),
    status: 'Draft',
    type: 'Farmer'
  };
  logger.debug('Creating new user for the farmer in DB');
  const userResult = await userModelApi.create(
    {
      personalDetails: farmerInput.personalDetails,
      roles: { [data.collective.slug]: ['FARMER'], farmbook: ['FARMER'] },
      status: 'Draft',
    },
    userId,
  );
  logger.debug('Farmer user object created');
  logger.debug('Creating new farmer in DB');
  const createResult = await modelApi.create(
    {
      ...farmerInput,
      userId: userResult.insertedId.toString(),
    },
    userId,
  );
  logger.debug('Farmer object created');
  return createResult;
};