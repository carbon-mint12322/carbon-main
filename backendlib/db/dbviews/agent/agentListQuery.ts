import getAppName from '~/backendlib/locking/getAppName';
import { getModel } from '../../adapter';

const schemaId = '/farmbook/agent';
const modelApi = getModel(schemaId);
const listagents = (pipeline: any = {}) => modelApi.aggregate(pipeline);

const TENANT_NAME = process.env.TENANT_NAME || 'reactml-dev';

export const agentListQuery = async (query = {}) => {
  const filter = [
    {
      $match: query,
    },
    {
      $project: {
        userId: {
          $toObjectId: '$userId',
        },
      },
    },
    {
      $lookup: {
        from: `/${TENANT_NAME}/farmbook/users`,
        localField: 'userId',
        foreignField: '_id',
        as: 'results',
      },
    },
    {
      $match: {
        [`results.0.roles.${getAppName()}`]: {
          $in: ['FIELD_OFFICER'],
        },
      },
    },
    { $addFields: { userItem: { $arrayElemAt: ['$results', 0] } } },
    { $addFields: { personalDetails: { $mergeObjects: ['$userItem.personalDetails'] } } },
  ];

  return await listagents(filter);
};
