const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const AGENT_SCHEMA_ID = model2schemaId('agent');
const AgentApi = MongoAdapter.getModel(AGENT_SCHEMA_ID);

export const agentDetailsViewQuery = async (userId: any) => {
  const dbResult = await AgentApi.aggregate([
    { $match: { userId: userId } },
    { $addFields: { agentId: { $toString: '$_id' } } },
    { $addFields: { userObjId: { $toObjectId: userId } } },
    {
      $lookup: {
        from: model2collection('users'),
        localField: 'userObjId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'user',
      },
    },
    {
      $project: {
        agentId: 1,
        personalDetails: 1,
        userId: 1,
        user: { personalDetails: 1},
        collectives: {
          $map: {
            input: '$collectives',
            as: 'collective',
            in: {
              $convert: {
                input: '$$collective',
                to: 'objectId',
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectives',
        foreignField: '_id',
        as: 'collectives',
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult?.map((item: any) => ({
      ...item,
      personalDetails: {...item.user[0].personalDetails},
      id: item.agentId,
      collectives: item.collectives.map((c: any) => ({ ...c, id: c._id })),
    }));
    return result[0];
  } catch (e) {
    console.log('ERROR in agentDetailsViewQuery:postProcess', e);
  }
};
