const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const TASK_SCHEMA_ID = model2schemaId('task');
const TaskApi = MongoAdapter.getModel(TASK_SCHEMA_ID);

export const taskDetailsViewQuery = async (taskId: any) => {
  const dbResult = await TaskApi.aggregate([
    { $match: { _id: new ObjectId(taskId) } },
    { $addFields: { taskId: { $toString: '$_id' } } },
    { $addFields: { assigneeObjectId: { $toObjectId: '$assignee' } } },
    {
      $lookup: {
        from: model2collection('users'),
        localField: 'assigneeObjectId',
        foreignField: '_id',
        as: 'assigneeUsers',
      },
    },
    { $addFields: { assigneeUser: { $arrayElemAt: ['$assigneeUsers', 0] } } },
    { $addFields: { assignorObjectId: { $toObjectId: '$assignor' } } },
    {
      $lookup: {
        from: model2collection('users'),
        localField: 'assignorObjectId',
        foreignField: '_id',
        as: 'assignorUsers',
      },
    },
    { $addFields: { assignorUser: { $arrayElemAt: ['$assignorUsers', 0] } } },
    {
      $lookup: {
        from: model2collection('histories'),
        let: { farmerId: '$farmerId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$relatedTo.objectId', '$$farmerId'] },
                  { $eq: ['$relatedTo.schemaId', '/farmbook/farmer'] },
                ],
              },
            },
          },
          {
            $addFields: {
              objectIdCreatedBy: {
                $toObjectId: '$createdBy',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('users'),
              localField: 'objectIdCreatedBy',
              foreignField: '_id',
              as: 'createdByUser',
            },
          },
          {
            $addFields: {
              createdByUserItem: {
                $arrayElemAt: ['$createdByUser', 0],
              },
            },
          },
          {
            $project: {
              createdBy: 0,
            },
          },
        ],
        as: 'histories',
      },
    },
    {
      $project: {
        taskId: 1,
        name: 1,
        desc: 1,
        dueDate: 1,
        priority: 1,
        assignee: 1,
        status: 1,
        category: 1,
        documents: 1,
        comments: 1,
        reminders: 1,
        assignor: 1,
        assigneeUser: 1,
        assignorUser: 1,
        histories: {
          _id: 1,
          relatedTo: 1,
          modifications: 1,
          createdBy: 1,
          createdAt: 1,
          userItem: { $arrayElemAt: ['$histories.createdByUserItem', 0] },
        },
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log('DB Result for poultry query', dbResult, POULTRY_SCHEMA_ID);
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
    console.log('ERROR taskDetailsViewQuery:postProcess', e);
  }
};
