const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

export const cropQRViewQuery = async (cropId: any) => {
  console.log('IN View');
  const dbResult = await CropApi.aggregate([
    { $match: { _id: ObjectId(cropId) } },
    { $addFields: { cropId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'cropId',
        foreignField: 'cropId',
        as: 'events',
        pipeline: [{ $match: { category: 'Crop' } }],
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
    { $addFields: { lpID: { $toString: '$landParcel.id' } } },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'lpID',
        foreignField: 'landParcel',
        as: 'landParcelsFarmer',
      },
    },
    {
      $project: {
        cropTag: 1,
        cropId: 1,
        name: 1,
        areaInAcres: 1,
        farmer: 1,
        landParcel: 1,
        climateScore: 1,
        complianceScore: 1,
        seedVariety: 1,
        seedSource: 1,
        cropType: 1,
        status: 1,
        actualYieldTonnes: 1,
        actualSowingDate: 1,
        actualHarvestDate: 1,
        documents: 1, // TODO: not available on all four models
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          notes: 1,
          location: 1,
          details: {
            durationAndExpenses: {
              startDate: 1,
              endDate: 1,
            },
          },
        },
        farmerDetails: {
          _id: 1,
          personalDetails: { firstName: 1, lastName: 1, address: 1 },
          operatorDetails: {
            farmerID: 1,
          },
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
          percentile: 1, // TODO: field not available
        },
        landParcelsFarmer: 1,
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
        cropData: {
          ...item,
          id: item.cropId,
          events: item.events.map((e: any) => ({ ...e, id: e._id })),
        },
        farmerData: item.farmerDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        lpData: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
        documents: item.documents,
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in cropQRViewQuery:postProcess', e);
  }
};
