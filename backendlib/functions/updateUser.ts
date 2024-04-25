import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';
import md5 from 'md5';
import getAppName from '~/backendlib/locking/getAppName';

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
  const farmbookRoles: string[] = [];
  const roles = data.roles.reduce((acc: { [key: string]: string[] }, role: Role) => {
    const collective = collectives?.find((e: any) => e._id?.toString() === role.operator);
    farmbookRoles.push(...role.rolesList);
    return {
      ...acc,
      [collective.slug]: role.rolesList,
      [getAppName()]: farmbookRoles
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

export const updateUser = async (id: string, mods: any, userId: string) => {
  const collectiveIds: ObjectId[] = [];
  const agentCollectiveIds: string[] = [];
  if (mods.roles) {
    mods.roles?.forEach((role: Role) => {
      collectiveIds.push(new ObjectId(role.operator));
      if (!role.rolesList.includes('FARMER')) {
        agentCollectiveIds.push(role.operator);
      }
    });
  }
  const collectives = await fetchCollectives({
    _id: { $in: collectiveIds },
  });

  const parsedUserData = mods.roles ? await userRoleParser(mods, collectives) : mods;
  const parsedUserDataWithModPin = parsedUserData?.pin ? { ...parsedUserData, pin: md5(parsedUserData.pin) } : parsedUserData
  const parsedData = await uploadFormFile(parsedUserDataWithModPin);
  const result = await modelApi.update(id, parsedData, userId);
  // update agent object
  if (agentCollectiveIds.length > 0) {
    const agent = await agentsModelApi.getByFilter({ userId: id });
    if (agent) {
      agent.collectives.push(...agentCollectiveIds);
      const unique = agent.collectives.filter((c: any, index: any) => {
        return agent.collectives.indexOf(c) === index;
      });
      const mods = {
        collectives: unique,
      };
      logger.debug('Creating new Agent in DB');
      await agentsModelApi.update(agent._id.toString(), mods, userId);
      logger.debug('Agent object created');
    }
  }
  return result;
};
