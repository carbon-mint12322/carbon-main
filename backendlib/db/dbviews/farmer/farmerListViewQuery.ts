import { Console } from 'winston/lib/winston/transports';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const farmerListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await FarmerApi.aggregate([
    {
      $match: {
        $and: [
          { ...filter, collectives: collectiveId }, // Your existing filter
          {
            $or: [
              { type: { $exists: false } }, // Ignore the condition if type doesn't exist
              { type: 'Farmer' }, // Check if type exists and equals 'Farmer'
            ],
          },
        ],
      },
    },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    { $addFields: { farmerId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'farmerId',
        foreignField: 'farmer',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelFarmers',
      },
    },
    {
      $addFields: {
        landParcelFarmers: {
          $map: {
            input: '$landParcelFarmers',
            in: {
              landParcel: {
                $toObjectId: '$$this.landParcel',
              },
              own: '$$this.own',
            },
          },
        },
      },
    },

    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'landParcelFarmers.landParcel',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcels',
      },
    },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'farmerId',
        foreignField: 'farmer.id',
        pipeline: [{ $match: { active: true } }],
        as: 'crops',
      },
    },
    {
      $project: {
        fbId: 1,
        farmerId: 1,
        personalDetails: 1,
        personalOrgDetails: { identificationNumber: 1 },
        operatorDetails: 1,
        active: 1,
        status: 1,
        type: 1,
        crops: { _id: 1, name: 1 },
        landParcels: { _id: 1, name: 1, areaInAcres: 1 },
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
      id: item.farmerId,
      name: item.personalDetails?.firstName + ' ' + item.personalDetails?.lastName,
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in farmerListViewQuery:postProcess', e);
  }
};
