const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const AQUACROP_SCHEMA_ID = model2schemaId('aquacrop');
const AquaCropApi = MongoAdapter.getModel(AQUACROP_SCHEMA_ID);

export const aquacropQRViewQuery = async (aquacropId: any) => {
  console.log('IN View');
  const dbResult = await AquaCropApi.aggregate([
    { $match: { _id: ObjectId(aquacropId) } },
    { $addFields: { aquacropId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'aquacropId',
        foreignField: 'aquacropId',
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
        aquacropId: 1,
        cropType: 1,
        cropSubType: 1,
        quantity: 1,
        plannedStockingDate: 1,
        estHarvestDate: 1,
        estimatedYieldTonnes: 1,
        seedVariety: 1,
        seedSource: 1,
        seedEvidence: 1,
        seedCertificate: 1,
        actualYieldTonnes: 1,
        actualStockingDate: 1,
        actualHarvestDate: 1,
        costOfCultivation: 1,
        risk: 1,
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
        aquacropData: {
          ...item,
          id: item.aquacropId,
          events: item.events.map((e: any) => ({ ...e, id: e._id })),
        },
        farmerData: item.farmerDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        lpData: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
        documents: item.documents,
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in aquacropQRViewQuery:postProcess', e);
  }
};
