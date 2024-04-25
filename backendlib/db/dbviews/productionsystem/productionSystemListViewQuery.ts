const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PRODUCTION_SYSTEM_SCHEMAID = model2schemaId('productionsystems');
const ProductionSystemApi = MongoAdapter.getModel(PRODUCTION_SYSTEM_SCHEMAID);

export const productionSystemListViewQuery = async (
  filter = {},
  collectiveId?: string,
  options?: any,
) => {
  const dbResult = await ProductionSystemApi.aggregate([
    { $match: filter },
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel' } } },
    { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
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
      id: item.landParcelId,
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in productionSystemListViewQuery:postProcess', e);
  }
};
