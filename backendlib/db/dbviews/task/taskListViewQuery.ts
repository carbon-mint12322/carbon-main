import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const TASK_SCHEMA_ID = model2schemaId('tasks');
const TaskApi = MongoAdapter.getModel(TASK_SCHEMA_ID);

export const taskListViewQuery = async (filter = {}, options?: any) => {
  const dbResult = await TaskApi.aggregate([
    { $match: filter },
    { $addFields: {sortDate: {$toDate: '$createdAt'}}},
    { $sort: { sortDate: -1 } },
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
      id: item.taskId,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in taskListViewQuery:postProcess', e);
  }
};
