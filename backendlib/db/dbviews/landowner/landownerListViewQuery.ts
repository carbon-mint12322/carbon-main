import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const LANDOWNER_SCHEMA_ID = model2schemaId('landowners');
const LandownerApi = MongoAdapter.getModel(LANDOWNER_SCHEMA_ID);

export const landownerListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await LandownerApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { landownerId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('landparcels'),  // Assuming 'landparcels' is the collection name
        let: { landownerId: '$landownerId' },   // Assuming 'landownerId' is the field in the current collection
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$landownerId", { $ifNull: ['$landowners.id', []] }],
              },
            },
          },
        ],
        as: 'landparcels',
      },
    },

    {
      $project: {

        landownerId: 1,
        fbId: 1,
        personalDetails: 1,
        gender: 1,
        additionalDetails: 1,
        active: 1,
        status: 1,
        landparcels: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          address: 1,
          surveyNumber: 1,
          map: 1,
          location: 1,
          active: 1,
          status: 1,
        },
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log("Lanodowners list", dbResult);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.landownerId,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in landownerListViewQuery:postProcess', e);
  }
};
