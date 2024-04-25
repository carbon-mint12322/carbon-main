const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('poultry');
const PoultryApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const poultryQRViewQuery = async (poultryId: any) => {
  console.log('IN View');
  const dbResult = await PoultryApi.aggregate([
    { $match: { _id: ObjectId(poultryId) } },
    { $addFields: { poultryId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'poultryId',
        foreignField: 'poultryId',
        as: 'events',
      },
    },
    { $addFields: { farmerObjectId: { $toObjectId: '$farmer.id' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        as: 'farmerDetails',
      },
    },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel.id' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        as: 'landParcelDetails',
      },
    },
    {
      $project: {
        poultryId: 1,
        batchIdName: 1,
        poultryType: 1,
        purpose: 1,
        size: 1,
        chickPlacementDay: 1,
        chickSource: 1,
        breed: 1,
        estHarvestDate: 1,
        status: 1,
        actualYieldTonnes: 1,
        actualSowingDate: 1,
        actualHarvestDate: 1,
        documents: 1,
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          notes: 1,
          location: 1,
          startDate: 1,
          endDate: 1,
        },
        farmerDetails: {
          _id: 1,
          personalDetails: { firstName: 1, lastName: 1, address: 1 },
          personalOrgDetails: 1,
          farmingExperience: 1,
        },
        landParcelDetails: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          climateScore: 1,
          complianceScore: 1,
          landOwner: 1,
          map: 1,
          location: 1,
          own: 1,
        },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => {
      return {
        poultryData: {
          ...item,
          id: item.poultryId,
          events: item.events.map((e: any) => ({ ...e, id: e._id })),
        },
        farmerData: item.farmerDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        lpData: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
        documents: item.documents,
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in poultryQRViewQuery:postProcess', e);
  }
};
