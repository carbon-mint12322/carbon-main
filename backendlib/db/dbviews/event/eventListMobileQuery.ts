const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const eventListMobileQuery = async (farmerId: any) => {
  try {
    const dbResult = await FarmerApi.aggregate([
      { $match: { _id: ObjectId(farmerId) } },
      { $addFields: { farmerId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: model2collection('landparcel_farmers'),
          localField: 'farmerId',
          foreignField: 'farmer',
          as: 'landParcelFarmers',
        },
      },
      {
        $lookup: {
          from: model2collection('events'),
          localField: 'landParcelFarmers.landParcel',
          foreignField: 'landParcelId',
          as: 'landParcelEvents',
          pipeline: [
            { $match: { category: 'Submission' } },
            {
              $sort: { createdAt: -1 },
            },
          ],
        },
      },
      {
        $lookup: {
          from: model2collection('crops'),
          localField: 'farmerId',
          foreignField: 'farmer.id',
          as: 'crops',
        },
      },
      {
        $addFields: {
          cropsMod: {
            $map: {
              input: '$crops',
              in: {
                cropId: {
                  $toString: '$$this._id',
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: model2collection('events'),
          localField: 'cropsMod.cropId',
          foreignField: 'cropId',
          as: 'cropEvents',
          pipeline: [
            { $match: { category: 'Submission' } },
            {
              $sort: { createdAt: -1 },
            },
          ],
        },
      },
      {
        $project: {
          landParcelEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            landParcelId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            _id: 1,
          },
          cropEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            cropId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            planId: 1,
            _id: 1,
          },
        },
      },
    ]);
    // Massage the output to the desired format
    return postProcess(dbResult);
  } catch (e) {
    console.log('ERROR in eventListMobileQuery', e);
  }
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      landParcelEvents: item.landParcelEvents.map((l: any) => ({
        id: l._id.toString(),
        ts: l.createdAt,
        lat: l.location?.lat,
        lng: l.location?.lng,
        category: l.category,
        eventId: l._id.toString(),
        landParcelId: l.landParcelId,
        image: l.photoRecords,
        audio: l.audioRecords,
        notes: l.notes,
      })),
      cropEvents: item.cropEvents.map((c: any) => ({
        id: c._id.toString(),
        ts: c.createdAt,
        lat: c.location?.lat,
        lng: c.location?.lng,
        eventId: c._id.toString(),
        cropId: c.cropId,
        image: c.photoRecords,
        audio: c.audioRecords,
        notes: c.notes,
      })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in eventListMobileQuery:postProcess', e);
  }
};
