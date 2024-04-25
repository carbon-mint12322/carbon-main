import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FIELD_SCHEMA_ID = model2schemaId('field');
const FieldApi = MongoAdapter.getModel(FIELD_SCHEMA_ID);

export const fieldListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await FieldApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { fieldId: { $toString: '$_id' } } },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelDetails',
      },
    },
    {
      $lookup: {
        from: model2collection('croppingsystems'),
        let: { fieldId: '$fieldId' },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ['$field', '$$fieldId'] }, { $eq: ['$active', true] }] },
            },
          },
          { $match: { active: true } },
        ],
        as: 'croppingSystem',
      },
    },

    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcel',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelFarmers',
      },
    },
    { $addFields: { landParcelFarmer: { $arrayElemAt: ['$landParcelFarmers', 0] } } },
    { $addFields: { farmerObjectId: { $toObjectId: '$landParcelFarmer.farmer' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'farmer',
      },
    },
    {
      $project: {
        fbId: 1,
        name: 1,
        areaInAcres: 1,
        calculatedAreaInAcres: 1,
        landParcel: 1,
        active: 1,
        landParcelDetails: {
          _id: 1,
          name: 1,
          location: 1,
          address: { village: 1 },
        },
        farmer: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        croppingSystem: { name: 1 },
        fieldType: 1,
        landParcelMap: 1,
      },
    },
  ]);
  // Massage the output to the desired format
  // console.log('DB Result', dbResult);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
      landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in fieldListViewQuery:postProcess', e);
  }
};
