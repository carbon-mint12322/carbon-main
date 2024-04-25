const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PRODUCTION_SYSTEM_SCHEMAID = model2schemaId('processingsystems');
const ProcessingSystemApi = MongoAdapter.getModel(PRODUCTION_SYSTEM_SCHEMAID);

export const processingSystemDetailsViewQuery = async (processingSystemId: any) => {
  const dbResult = await ProcessingSystemApi.aggregate([
    { $match: { _id: new ObjectId(processingSystemId) } },
    { $addFields: { processingSystemId: { $toString: '$_id' } } },
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
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        as: 'fields',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        let: { processingSystemId: '$processingSystemId' },
        localField: 'processingSystemId',
        foreignField: 'processingSystemId',
        as: 'events',
        pipeline: [
          { $match: { status: { $ne: 'archived' } } },
          { $addFields: { sortDate: { $toDate: '$createdAt' } } },
          { $sort: { sortDate: -1 } },
          {
            $addFields: {
              createdById: {
                $toObjectId: '$createdBy',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('users'),
              localField: 'createdById',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'users',
            },
          },
          {
            $addFields: {
              extractedPhotoIds: {
                $map: {
                  input: '$photoRecords',
                  as: 'photo',
                  in: {
                    $arrayElemAt: [{ $split: ['$$photo.link', '/'] }, -1],
                  },
                },
              },
            },
          },
          {
            $lookup: {
              from: `${process.env.TENANT_NAME}.files`,
              localField: 'extractedPhotoIds',
              foreignField: 'filename',
              as: 'photosData',
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        category: 1,
        name: 1,
        field: 1,
        landParcel: 1,
        pondType: 1,
        depth: 1,
        shape: 1,
        waterSource: 1,
        aerationSystem: 1,
        feedingArea: 1,
        autoFeeders: 1,
        waterInlet: 1,
        waterOutlet: 1,
        shadeStructures: 1,
        otherInfra: 1,
        constructionDate: 1,
        additionalInfo: 1,
        status: 1,
        active: 1,
        collective: 1,
        location: 1,
        map: 1,
        landParcels: {
          _id: 1,
          name: 1,
          location: 1,
          map: 1,
          address: { village: 1 },
        },
        farmers: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        fields: { _id: 1, fbId: 1, name: 1, map: 1 },
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          location: 1,
          photoRecords: 1,
          startDate: 1,
          endDate: 1,
          details: 1,
          users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
          photosData: { filename: 1, metadata: 1 },
          processingSystemId: 1,
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
      location: item.landParcels[0].location,
      map: item.fields[0].map,
      events: item.events.map((e: any) => ({
        ...e,
        id: e._id,
        createdBy: {
          id: e.createdBy,
          name:
            e.users[0]?.personalDetails.firstName +
            ' ' +
            (e.users[0]?.personalDetails.lastName || ''),
        },
      })),
    }));
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR in croppingSystemDetailsViewQuery:postProcess', e);
  }
};
