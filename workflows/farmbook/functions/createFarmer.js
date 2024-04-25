import getAppName from '~/backendlib/locking/getAppName';
import { getModel } from '../../../backendlib/db/adapter';
import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';

const farmerSchemaId = '/farmbook/farmer';
const farmerDbApi = getModel(farmerSchemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);

const createFarmer = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating farmer object');
  const { domainContextObjectId: operatorId } = wf;
  delete event.data.name;
  const parsedData = await uploadFormFile(event.data);
  const farmerInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collectives: [operatorId],
    fbId: generateLocalId(session.org, event.data.type || 'FR'),
    status: 'Draft',
  };
  logger.debug('Creating new user for the farmer/processor in DB');
  const role = event.data.type && event.data.type === 'Processor' ? 'PROCESSOR' : 'FARMER';
  const userResult = await userModelApi.create(
    {
      personalDetails: farmerInput.personalDetails,
      roles: { [session.org]: [role], farmbook: [role] },
      status: 'Draft',
    },
    session.userId,
  );
  logger.debug('Farmer/Processor user object created');
  logger.debug('Creating new farmer/processor in DB');
  const createResult = await farmerDbApi.create(
    {
      ...farmerInput,
      userId: userResult.insertedId.toString(),
    },
    session.userId,
  );
  logger.debug('Farmer/Processor object created');
  wf.domainObjectId = createResult.insertedId;
  return {};
};

export default createFarmer;
