import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('goat');
const GoatApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const goatListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await GoatApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { goatId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'goatId',
        foreignField: 'goatId',
        as: 'events',
      },
    },
    {
      $project: {
        goatId: 1,

        tagId: 1,
        age: 1,
        breed: 1,
        gender: 1,
        goatSource: 1,
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
      id: item.goatId,
      events: item.events.map((e: any) => ({ ...e, id: e._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in goatListViewQuery:postProcess', e);
  }
};
