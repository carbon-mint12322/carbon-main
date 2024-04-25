const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const SHEEP_SCHEMA_ID = model2schemaId('sheep');
const SheepApi = MongoAdapter.getModel(SHEEP_SCHEMA_ID);

export const sheepQRViewQuery = async (sheepId: any) => {
  console.log('IN View');
  const dbResult = await SheepApi.aggregate([
    { $match: { _id: ObjectId(sheepId) } },
    { $addFields: { sheepId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'sheepId',
        foreignField: 'sheepId',
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
        sheepId: 1,
        sheepSource: 1,
        breed: 1,
        gender: 1,
        age: 1,
        dob: 1,
        tagId: 1,
        pedigree: 1,
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
        sheepData: {
          ...item,
          id: item.sheepId,
          events: item.events.map((e: any) => ({ ...e, id: e._id })),
        },
        farmerData: item.farmerDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        lpData: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
        documents: item.documents,
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in sheepQRViewQuery:postProcess', e);
  }
};
