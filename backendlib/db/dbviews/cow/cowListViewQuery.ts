import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('cow');
const CowApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const cowListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await CowApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { cowId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'cowId',
        foreignField: 'cowId',
        as: 'events',
        pipeline: [
          { $match: { status: { $ne: 'archived' } } },
          { $addFields: { sortDate: { $toDate: '$createdAt' } } },
          { $sort: { sortDate: -1 } },
        ],
      },
    },
    {
      $project: {
        cowId: 1,
        fbId: 1,
        tagId: 1,
        age: 1,
        breed: 1,
        gender: 1,
        cowSource: 1,
        pedigree: 1,
        acquisitionDay: 1,
        productionSystem: 1,
        pop: 1,

        field: 1,
        status: 1,
        farmer: 1,
        landParcel: 1,
        active: 1,
        events: { _id: 1, name: 1, createdAt: 1 },
        lactionaPeriodDays: 1,
        averageMilkProduction: 1,
        lactationPeriods: 1,
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
      id: item.cowId,
      events: item.events.map((e: any) => ({ ...e, id: e._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in cowListViewQuery:postProcess', e);
  }
};
