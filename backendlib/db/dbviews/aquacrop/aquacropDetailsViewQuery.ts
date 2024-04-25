const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const AQUACROP_SCHEMA_ID = model2schemaId('aquacrop');
const AquaCropApi = MongoAdapter.getModel(AQUACROP_SCHEMA_ID);

export const aquacropDetailsViewQuery = async (aquacropId: any) => {
  const dbResult = await AquaCropApi.aggregate([
    { $match: { _id: new ObjectId(aquacropId) } },
    { $addFields: { aquacropId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'aquacropId',
        foreignField: 'aquaId',
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
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'aquacropId',
        foreignField: 'aquaId',
        as: 'plan',
      },
    },
    { $addFields: { psObjectId: { $toObjectId: '$productionSystem' } } },
    {
      $lookup: {
        from: model2collection('productionsystems'),
        localField: 'psObjectId',
        foreignField: '_id',
        as: 'productionSystems',
      },
    },
    { $addFields: { productionSystem: { $arrayElemAt: ['$productionSystems', 0] } } },
    { $addFields: { fieldObjectId: { $toObjectId: '$productionSystem.field' } } },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        as: 'fieldDetails',
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
        field: 1,
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
        farmer: 1,
        landParcel: 1,
        climateScore: 1,
        complianceScore: 1,
        status: 1,
        documents: 1,
        history: 1,
        fbId: 1,
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          location: 1,
          photoRecords: 1,
          audioRecords: 1,
          documentRecords: 1,
          notes: 1,
          startDate: 1,
          endDate: 1,
          details: 1,
          users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        },
        aquaPop: 1,
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        productionSystem: 1,
        productionSystems: { _id: 1, name: 1, field: 1 },
        fieldDetails: { _id: 1, map: 1, location: 1, fbId: 1 },
        landParcelDetails: { _id: 1, map: 1, location: 1 },
        qrLink: 1,
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log('DB Result for aquacrop query', dbResult, AQUACROP_SCHEMA_ID);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => {
      const actualEvents: {
        _id: any;
        name: any;
        range: { start: any; end: any };
        details: { createdAt: any; createdBy: any; photoRecords: any };
      }[] = [];
      item.events.map((event: any) => {
        if (event.category === 'Aquaculture Crop') {
          const modEvent = {
            _id: event._id.toString(),
            name: event.name,
            range: {
              start: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.startDate
                : event.details?.startDate || event.details?.dateOfPurchase,
              end: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.endDate
                : event.details?.endDate || event.details?.dateOfPurchase,
            },
            details: {
              createdAt: event.createdAt,
              createdBy: event.createdBy?.name,
              photoRecords: event.details?.evidences,
              location: event.location,
              name: event.details?.name,
            },
          };
          actualEvents.push(modEvent);
        }
      });
      return {
        ...item,
        id: item.aquacropId,
        productionSystem: item.productionSystem?._id,
        entityProgress: {
          plan: {
            id: item.plan[0]?._id,
            name: item.plan[0]?.name,
            events: item.plan[0]?.events,
          },
          actual: {
            events: actualEvents,
          },
        },
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
        productionSystems: item.productionSystems.map((p: any) => ({ ...p, id: p._id })),
        fieldDetails: item.fieldDetails.map((f: any) => ({ ...f, id: f._id })),
        landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id })),
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in aquacropDetailsViewQuery:postProcess', e);
  }
};
