import { getModel } from '../db/adapter';
import getAppName from '../locking/getAppName';

const schemaId = `/farmbook/user`;
const modelApi = getModel(schemaId);

export const listUsers = (filter = {}, options?: any) =>
  modelApi.aggregate([
    { $match: { ...filter, [`roles.${getAppName()}`]: { $nin: ['FARMER', 'PROCESSOR'] } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
  ]);
