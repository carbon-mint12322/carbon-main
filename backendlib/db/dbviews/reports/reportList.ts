import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const REPORT_SCHEMA_ID = model2schemaId('reports');
const REPORTApi = MongoAdapter.getModel(REPORT_SCHEMA_ID);

export const reportListViewQuery = async (filter = {}, options?: any) => {
  const dbResult = await REPORTApi.aggregate([
    {
      $sort: { _id: -1 },
    },
    { $match: { ...filter } },
    {
      $addFields: {
        createdById: {
          $toObjectId: '$createdBy',
        },
      },
    },
    {
      $lookup: {
        from: model2collection('users'),
        localField: 'createdById',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'users',
      },
    },
    {
      $project: {
        reportName: 1,
        reportType: 1,
        createdAt: 1,
        reportUrl: 1,
        'users.personalDetails.firstName': 1,
        'users.personalDetails.lastName': 1,
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
      createdBy:
        (item.users[0]?.personalDetails.firstName || '') +
        ' ' +
        (item.users[0]?.personalDetails.lastName || ''),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in reportListViewQuery:postProcess', e);
  }
};
