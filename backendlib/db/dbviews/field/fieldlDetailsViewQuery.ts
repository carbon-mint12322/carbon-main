const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FIELD_SCHEMA_ID = model2schemaId('field');
const FieldApi = MongoAdapter.getModel(FIELD_SCHEMA_ID);

export const fieldDetailsViewQuery = async (fieldId: any) => {
  const dbResult = await FieldApi.aggregate([
    { $match: { _id: new ObjectId(fieldId) } },
    { $addFields: { fieldId: { $toString: '$_id' } } },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel' } } },
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
      $lookup: {
        from: model2collection('crops'),
        localField: 'fieldId',
        foreignField: 'field',
        pipeline: [{ $match: { active: true } }],
        as: 'crops',
      },
    },
    {
      $lookup: {
        from: model2collection('histories'),
        let: { fieldId: '$fieldId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$relatedTo.objectId', '$$fieldId'] },
                  { $eq: ['$relatedTo.schemaId', '/farmbook/field'] },
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
        _id: 1,
        fbId: 1,
        name: 1,
        areaInAcres: 1,
        calculatedAreaInAcres: 1,
        map: 1,
        fieldType: 1,
        landParcel: 1,
        active: 1,
        landParcelDetails: {
          _id: 1,
          name: 1,
          location: 1,
          map: 1,
          address: { village: 1 },
        },
        farmer: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        croppingSystem: { name: 1 },
        crops: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          croppingSystem: 1,
          seedVariety: 1,
          seedSource: 1,
          status: 1,
          landParcel: 1,
          plannedSowingDate: 1,
        },
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
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
      landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id })),
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
      histories: item.histories.map((h: any) => ({ ...h, id: h._id })),
    }));
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR in fieldDetailsViewQuery:postProcess', e);
  }
};
