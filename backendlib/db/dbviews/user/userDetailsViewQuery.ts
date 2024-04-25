const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const USER_SCHEMA_ID = model2schemaId('user');
const UserApi = MongoAdapter.getModel(USER_SCHEMA_ID);

export const userDetailsViewQuery = async (userId: any) => {
  const dbResult = await UserApi.aggregate([
    { $match: { _id: new ObjectId(userId) } },
    { $addFields: { userId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('agents'),
        localField: 'userId',
        foreignField: 'userId',
        as: 'agentsDetails',

        pipeline: [
          {
            $addFields: {
              toString_farmerid: {
                $toString: '$_id',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('farmers'),
              localField: 'toString_farmerid',
              foreignField: 'agents',
              as: 'farmer_details',
            },
          },
        ],
      },
    },
    { $addFields: { agentItem: { $arrayElemAt: ['$agentsDetails', 0] } } },

    {
      $project: {
        _id: 1,
        personalDetails: 1,
        roles: 1,
        personalOrgDetails: 1,
        documents: 1,
        history: 1,
        histories: 1,
        reportsTo: 1,
        agentItem: 1,
        farmers: 1,
        agents: 1,
        rolesCopy: 1,
        farmer_details: {
          personalDetails: { firstName: 1, lastName: 1, address: 1 },
        },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
    }));

    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR userDetailsViewQuery:postProcess', e);
  }
};
