import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PROCESSOR_SCHEMA_ID = model2schemaId('farmer');
const ProcessorApi = MongoAdapter.getModel(PROCESSOR_SCHEMA_ID);

export const processorListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await ProcessorApi.aggregate([
    {
      $match: {
        $and: [
          { ...filter, collectives: collectiveId }, // Your existing filter
          { type: { $exists: true, $eq: 'Processor' } }, // Check if type exists and equals 'Farmer'
        ],
      },
    },
    { $addFields: { processorId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $project: {
        fbId: 1,
        processorId: 1,
        personalDetails: 1,
        personalOrgDetails: { identificationNumber: 1 },
        operatorDetails: 1,
        active: 1,
        status: 1,
        type: 1,
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
      id: item.processorId,
      name: item.personalDetails?.firstName + ' ' + item.personalDetails?.lastName,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in processorListViewQuery:postProcess', e);
  }
};
