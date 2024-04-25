const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CROPPING_SYSTEM_SCHEMA_ID = model2schemaId('plot');
const PlotApi = MongoAdapter.getModel(CROPPING_SYSTEM_SCHEMA_ID);

export const plotDetailsViewQuery = async (plotId: any) => {
  const dbResult = await PlotApi.aggregate([
    { $match: { _id: new ObjectId(plotId) } },
    { $addFields: { plotId: { $toString: '$_id' } } },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel' } } },
    { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        as: 'landParcels',
      },
    },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcel',
        foreignField: 'landParcel',
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
        as: 'farmers',
      },
    },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'field',
        foreignField: 'field',
        as: 'crops',
      },
    },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        as: 'fields',
      },
    },
    {
      $lookup: {
        from: model2collection('histories'),
        let: { plotId: '$plotId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$relatedTo.objectId', '$$plotId'] },
                  { $eq: ['$relatedTo.schemaId', '/farmbook/plot'] },
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
        category: 1,
        name: 1,
        field: 1,
        landParcel: 1,
        status: 1,
        active: 1,
        collective: 1,
        landParcels: {
          _id: 1,
          name: 1,
          location: 1,
          map: 1,
          address: { village: 1 },
        },
        farmers: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        fields: { _id: 1, fbId: 1, name: 1 },
        crops: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          plot: 1,
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
      farmers: item.farmers.map((f: any) => ({ ...f, id: f._id })),
      fields: item.fields.map((d: any) => ({ ...d, id: d._id })),
      landParcels: item.landParcels.map((l: any) => ({ ...l, id: l._id })),
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
      histories: item.histories.map((h: any) => ({ ...h, id: h._id })),
    }));
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR in plotDetailsViewQuery:postProcess', e);
  }
};
