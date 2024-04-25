const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const EVENT_SCHEMA_ID = model2schemaId('event');
const EventApi = MongoAdapter.getModel(EVENT_SCHEMA_ID);
const FILE_SCHEMA_ID = `${process.env.TENANT_NAME}.files`;
const FileApi = MongoAdapter.getModel(FILE_SCHEMA_ID);

export const eventDetailsViewQuery = async (id: any) => {
  const dbResult = await EventApi.aggregate([
    { $match: { _id: new ObjectId(id) } },
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
    { $addFields: { cropObjectId: { $toObjectId: '$cropId' } } },
    { $addFields: { productionSystemObjectId: { $toObjectId: '$productionSystemId' } } },
    { $addFields: { processingSystemObjectId: { $toObjectId: '$processingSystemId' } } },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'cropObjectId',
        foreignField: '_id',
        as: 'crop',
      },
    },
    { $addFields: { cropItem: { $arrayElemAt: ['$crop', 0] } } },
    { $addFields: { fieldId: { $toString: '$cropItem.field' } } },

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
        ],
        as: 'croppingsystem',
      },
    },
    { $addFields: { cropLandparcelId: { $toString: '$cropItem.landParcel.id' } } },
    { $addFields: { cropLandparcelObjectId: { $toObjectId: '$cropLandparcelId' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'cropLandparcelObjectId',
        foreignField: '_id',
        as: 'cropLandparcel',
      },
    },
    { $addFields: { fieldObjectId: { $toObjectId: '$fieldId' } } },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        as: 'fieldDetails',
      },
    },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcelId' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        as: 'landparcel',
      },
    },
    { $addFields: { poultryObjectId: { $toObjectId: '$poultryId' } } },
    {
      $lookup: {
        from: model2collection('poultrybatches'),
        localField: 'poultryObjectId',
        foreignField: '_id',
        as: 'poultrybatch',
        pipeline: [
          { $addFields: { psObjectId: { $toObjectId: '$productionSystem' } } },
          {
            $lookup: {
              from: model2collection('productionsystems'),
              localField: 'psObjectId',
              foreignField: '_id',
              as: 'productionSystems',
            },
          },
        ],
      },
    },
    { $addFields: { cowObjectId: { $toObjectId: '$cowId' } } },
    {
      $lookup: {
        from: model2collection('cows'),
        localField: 'cowObjectId',
        foreignField: '_id',
        as: 'cow',
        pipeline: [
          { $addFields: { psObjectId: { $toObjectId: '$productionSystem' } } },
          {
            $lookup: {
              from: model2collection('productionsystems'),
              localField: 'psObjectId',
              foreignField: '_id',
              as: 'productionSystems',
            },
          },
        ],
      },
    },
    { $addFields: { aquaObjectId: { $toObjectId: '$aquaId' } } },
    {
      $lookup: {
        from: model2collection('aquacrops'),
        localField: 'aquaObjectId',
        foreignField: '_id',
        as: 'aquacrop',
        pipeline: [
          { $addFields: { psObjectId: { $toObjectId: '$productionSystem' } } },
          {
            $lookup: {
              from: model2collection('productionsystems'),
              localField: 'psObjectId',
              foreignField: '_id',
              as: 'productionSystems',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('productionsystems'),
        localField: 'productionSystemObjectId',
        foreignField: '_id',
        pipeline: [
          { $match: { active: true } },
          { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
          { $addFields: { productionSystemId: { $toString: '$_id' } } },
          {
            $lookup: {
              from: model2collection('fields'),
              localField: 'fieldObjectId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'fieldDetails',
            },
          },
          {
            $lookup: {
              from: model2collection('poultrybatches'),
              localField: 'productionSystemId',
              foreignField: 'productionSystem',
              pipeline: [{ $match: { active: true } }],
              as: 'poultrybatches',
            },
          },
          {
            $lookup: {
              from: model2collection('aquacrops'),
              localField: 'productionSystemId',
              foreignField: 'productionSystem',
              pipeline: [{ $match: { active: true } }],
              as: 'aquacrops',
            },
          },
          {
            $lookup: {
              from: model2collection('cows'),
              localField: 'productionSystemId',
              foreignField: 'productionSystem',
              pipeline: [{ $match: { active: true } }],
              as: 'cows',
            },
          },
          {
            $lookup: {
              from: model2collection('goats'),
              localField: 'productionSystemId',
              foreignField: 'productionSystem',
              pipeline: [{ $match: { active: true } }],
              as: 'goats',
            },
          },
          {
            $lookup: {
              from: model2collection('sheeps'),
              localField: 'productionSystemId',
              foreignField: 'productionSystem',
              pipeline: [{ $match: { active: true } }],
              as: 'sheep',
            },
          },
          { $addFields: { landParcelObjectId: { $toObjectId: '$landParcel' } } },
          {
            $lookup: {
              from: model2collection('landparcels'),
              localField: 'landParcelObjectId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'landParcelDetails',
            },
          },
        ],
        as: 'productionSystem',
      },
    },
    {
      $lookup: {
        from: model2collection('processingsystems'),
        localField: 'processingSystemObjectId',
        foreignField: '_id',
        pipeline: [
          { $match: { active: true } },
          { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
          { $addFields: { landParcelObjectId: { $toObjectId: '$landParcel' } } },
          { $addFields: { productionSystemId: { $toString: '$_id' } } },
          {
            $lookup: {
              from: model2collection('fields'),
              localField: 'fieldObjectId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'fieldDetails',
            },
          },

          {
            $lookup: {
              from: model2collection('landparcels'),
              localField: 'landParcelObjectId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'landParcelDetails',
            },
          },
        ],
        as: 'processingSystem',
      },
    },
    {
      $project: {
        active: 1,
        audioRecords: 1,
        category: 1,
        createdAt: 1,
        createdBy: 1,
        cropId: 1,
        productionSystemId: 1,
        processingSystemId: 1,
        landParcelId: 1,
        location: { lat: 1, lng: 1 },
        name: 1,
        notes: 1,
        photoRecords: 1,
        status: 1,
        locked: 1,
        planId: 1,
        details: 1,
        evidences: 1,
        _id: 1,
        validationWorkflowId: 1,
        productionSystem: 1,
        processingSystem: 1,
        crop: { name: 1, landParcel: 1, farmer: 1, field: 1, fbId: 1, cropTag: 1 },
        fieldDetails: { name: 1, map: 1 },
        landparcel: { name: 1, surveyNumber: 1, map: 1 },
        cropLandparcel: { name: 1, surveyNumber: 1, map: 1 },
        croppingsystem: { _id: 1, name: 1 },
        poultrybatch: {
          batchIdName: 1,
          poultryType: 1,
          landParcel: 1,
          farmer: 1,
          productionSystems: 1,
        },
        cow: 1,
        aquacrop: {
          _id: 1,
          cropType: 1,
          cropSubType: 1,
          fbId: 1,
          landParcel: 1,
          farmer: 1,
          productionSystems: 1,
        },
        users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        cropHealth: 1
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = async (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      crop: item.crop[0],
      landparcel: item.landparcel[0],
      cropLandparcel: item.cropLandparcel[0],
      fieldDetails: item.fieldDetails[0],
      poultrybatch: item.poultrybatch[0],
      aquacrop: item.aquacrop[0],
      cow: item.cow[0],
      croppingsystem: item.croppingsystem[0]
        ? { ...item.croppingsystem[0], id: item.croppingsystem[0]._id }
        : {},
      createdBy: {
        id: item.createdBy,
        name:
          item.users[0]?.personalDetails.firstName +
          ' ' +
          (item.users[0]?.personalDetails.lastName || ''),
      },
    }));
    const photoRecords = result?.[0].photoRecords;
    const markers: any[] = [
      { position: { lat: result?.[0].location?.lat, lng: result?.[0].location?.lng } },
    ];
    if (photoRecords) {
      const promises = photoRecords?.map(async (photo: any) => {
        const filename = photo.link.substring(photo.link.lastIndexOf('/') + 1);
        const file = await FileApi.findOneAtRoot({ filename });
        if (file) {
          markers.push({
            position: {
              lat: file.metadata?.location?.lat,
              lng: file.metadata?.location?.lng,
            },
          });
        }
      });
      await Promise.all(promises);
    }
    return JSON.parse(JSON.stringify({ ...result?.[0], markers }));
  } catch (e) {
    console.log('ERROR in eventDetailsViewQuery:postProcess', e);
  }
};
