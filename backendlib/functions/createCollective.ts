import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { createPlan } from './createPlan';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../collective/create');

const schemaId = `/farmbook/collective`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);
const agentsSchemaId = '/farmbook/agents';
const agentsModelApi = getModel(agentsSchemaId);

export const createCollective = async (data: any, userId: string) => {
  let createRequest = data.requestData;

  // add slug
  createRequest = { ...createRequest, slug: createRequest.name.toLowerCase().replaceAll(' ', '-') }

  const parsedData = await uploadFormFile(createRequest);

  const collectiveInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    fbId: generateLocalId(createRequest.name, 'OP'),
  };
  logger.debug('Creating new collective in DB');
  const createResult = await modelApi.create(collectiveInput, userId);
  logger.debug('Collective object created');
  logger.debug('Creating plan for collective in DB');
  await createPlan(
    createRequest.pop,
    '',
    createResult.insertedId.toString(),
    'collective',
    createRequest.plannedDate,
    userId,
    createRequest.slug,
    schemaId,
  );
  logger.debug('Plan object created');
  logger.debug('Updating user with new collective access in DB');
  const user = await userModelApi.get(userId);
  await userModelApi.update(
    userId,
    { roles: { ...user.roles, [createRequest.slug]: ['AGENT', 'ADMIN'] } },
    userId,
  );
  const agent = await agentsModelApi.getByFilter({ userId: userId });
  agent.collectives.push(createResult.insertedId.toString());
  await agentsModelApi.update(
    agent._id,
    {
      collectives: agent.collectives,
    },
    userId,
  );
  logger.debug('User/Agent object updated');
  return createResult;
};
