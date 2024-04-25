import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';
import getAppName from '../locking/getAppName';
import md5 from 'md5';

const logger = makeLogger('/api/.../user/create');

const schemaId = `/farmbook/user`;
const modelApi = getModel(schemaId);
const collectiveSchemaId = '/farmbook/collective';
const collectiveModelApi = getModel(collectiveSchemaId);
const agentsSchemaId = '/farmbook/agents';
const agentsModelApi = getModel(agentsSchemaId);

interface Role {
  operator: string;
  rolesList: string[];
}

const userRoleParser = async (data: any, collectives: any) => {
  const rolesCopy = data.roles;
  const roles = data.roles.reduce((acc: { [key: string]: string[] }, role: Role) => {
    const collective = collectives?.find((e: any) => e._id?.toString() === role.operator);
    return {
      ...acc,
      [collective.slug]: role.rolesList,
      [getAppName()]: role.rolesList
    };
  }, {});
  return {
    ...data,
    roles,
    rolesCopy,
  };
};

export const fetchCollectives = (filter = {}, options?: any) =>
  collectiveModelApi.list(filter, options);

export const createUser = async (data: any, userId: string) => {
  const agentCollectiveIds: string[] = [];
  const collectiveIds: ObjectId[] = [];
  data.requestData.roles.forEach((role: Role) => {
    collectiveIds.push(new ObjectId(role.operator));
    if (!role.rolesList.includes('FARMER')) {
      agentCollectiveIds.push(role.operator);
    }
  });
  const collectives = await fetchCollectives({
    _id: { $in: collectiveIds },
  });
  const parsedUserData = await userRoleParser(data.requestData, collectives);

  const parsedData: any = await uploadFormFile(parsedUserData);
  const lpInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    fbId: generateLocalId(data.collective.name, 'UR'),
    ...(parsedData.pin ? { pin: md5(parsedData.pin) } : {}),
  };
  logger.debug('Creating new User in DB');
  const createResult = await modelApi.create(lpInput, userId);
  logger.debug('User object created');

  // create an agent object
  if (agentCollectiveIds.length > 0) {
    const agentObject = {
      personalDetails: data.requestData.personalDetails,
      userId: createResult.insertedId.toString(),
      collectives: agentCollectiveIds,
    };
    logger.debug('Creating new Agent in DB');
    await agentsModelApi.create(agentObject, userId);
    logger.debug('Agent object created');
  }

  return createResult;
};
