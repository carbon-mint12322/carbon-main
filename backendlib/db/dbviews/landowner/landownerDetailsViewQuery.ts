const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const LANDOWNER_SCHEMA_ID = model2schemaId('landowners');
const LandownerApi = MongoAdapter.getModel(LANDOWNER_SCHEMA_ID);

export const landownerDetailsViewQuery = async (landownerId: any) => {
  const dbResult = await LandownerApi.aggregate([
    { $match: { _id: new ObjectId(landownerId) } },
    { $addFields: { landownerId: { $toString: '$_id' } } },
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
        personalDetails: 1,
        gender: 1,
        additionalDetails: 1,
        active: 1,
        documents: 1,
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
  console.log("Lanodowners list", dbResult);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.landownerId,
      landparcels: item.landparcels.map((c: any) => ({ ...c, id: c._id })),
    }));
    return JSON.parse(JSON.stringify(result[0]));
  } catch (e) {
    console.log('ERROR in landownerDetailsViewQuery:postProcess', e);
  }
};
