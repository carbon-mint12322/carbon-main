const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('poultrybatches');
const PoultryApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const poultryDetailsViewQuery = async (poultryId: any) => {
  const dbResult = await PoultryApi.aggregate([
    { $match: { _id: new ObjectId(poultryId) } },
    { $addFields: { poultryId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'poultryId',
        foreignField: 'poultryId',
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
        localField: 'poultryId',
        foreignField: 'poultrybatchId',
        pipeline: [
          {
            $match: 
              { active: true }
          }
        ],
        as: 'plan',
      },
    },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'poultryId',
        foreignField: 'poultryId',
        pipeline: [
          {
            $match:
              { active: true }
          }
        ],
        as: 'oldplan',
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
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        as: 'landParcelDetails',
      },
    },
    { $addFields: { farmerObjectId: { $toObjectId: '$farmer' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        as: 'farmers',
        pipeline: [
          {
            $match: { active: true },
          },
        ],
      },
    },
    {
      $project: {
        poultryId: 1,
        field: 1,
        batchIdName: 1,
        poultryType: 1,
        purpose: 1,
        size: 1,
        chickPlacementDay: 1,
        chickSource: 1,
        breed: 1,
        actualSize: 1,
        estHarvestDate: 1,
        actualHarvestDate: 1,
        actualYieldSize: 1,
        actualYieldTonnes: 1,
        actualChickPlacementDay: 1,
        poultryPop: 1,
        productionSystem: 1,
        dayMortality: 1,
        cumulativeMortality: 1,
        mortalityPercentage: 1,
        weightGain: 1,
        risk: 1,
        feedStock: 1,
        feedExpiry: 1,
        landParcel: 1,
        climateScore: 1,
        complianceScore: 1,
        status: 1,
        documents: 1,
        history: 1,
        costOfCultivation: 1,
        validationWorkflowId: 1,
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
        },
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        oldplan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        fieldDetails: { _id: 1, map: 1, location: 1, fbId: 1 },
        landParcelDetails: { _id: 1, name: 1,  map: 1, location: 1 },
        farmers: {_id: 1, personalDetails: 1},
        qrLink: 1,
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => {
      const actualEvents: {
        _id: any;
        id: any;
        name: any;
        range: { start: any; end: any };
        details: { createdAt: any; createdBy: any; photoRecords: any };
      }[] = [];
      item.events.map((event: any) => {
        if (event.category === 'Poultry') {
          const modEvent = {
            _id: event?._id.toString(),
            id: event?._id.toString(),
            name: event.name,
            range: {
              start: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.startDate
                : event.details?.startDate || event.details?.dateOfPurchase || event.details?.dateOfWeighing,
              end: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.endDate
                : event.details?.endDate || event.details?.dateOfPurchase || event.details?.dateOfWeighing,
            },
            details: {
              createdAt: event.createdAt,
              createdBy: {
                id: event.createdBy,
                name:
                  event.users[0]?.personalDetails.firstName +
                  ' ' +
                  (event.users[0]?.personalDetails.lastName || ''),
             } ,
              photoRecords: event.details?.evidences,
              location: event.location,
              name: event.details?.name,
            },
          };
          actualEvents.push(modEvent);
        }
      });
      return {
        poultryId: item.poultryId,
        field: item.field,
        batchIdName: item.batchIdName,
        poultryType: item.poultryType,
        purpose: item.purpose,
        size: item.size,
        chickPlacementDay: item.chickPlacementDay,
        chickSource: item.chickSource,
        breed: item.breed,
        actualSize: item.actualSize,
        estHarvestDate: item.estHarvestDate,
        actualHarvestDate: item.actualHarvestDate,
        actualYieldSize: item.actualYieldSize,
        actualYieldTonnes: item.actualYieldTonnes,
        actualChickPlacementDay: item.actualChickPlacementDay,
        dayMortality: item.dayMortality,
        cumulativeMortality: item.poulcumulativeMortalitytryId,
        mortalityPercentage: item.mortalityPercentage,
        weightGain: item.weightGain,
        risk: item.risk,
        feedStock: item.feedStock,
        feedExpiry: item.feedExpiry,
        farmer: item.farmer,
        landParcel: item.landParcel,
        climateScore: item.climateScore,
        complianceScore: item.complianceScore,
        status: item.status,
        documents: item.documents,
        costOfCultivation: item.costOfCultivation,
        validationWorkflowId: item.validationWorkflowId,
        qrLink: item.qrLink,
        id: item.poultryId,
        entityProgress: {
          plan: {
            id: item.plan ? item.plan[0]?._id : item.oldplan[0]?._id,
            name: item.plan ? item.plan[0]?.name : item.oldplan[0]?.name,
            events: item.plan ? item.plan[0]?.events : item.oldplan[0]?.events,
          },
          actual: {
            events: actualEvents,
          },
        },
        productionSystem: item.productionSystem?._id.toString(),
        events: item.events.map((e: any) => ({
          ...e,
          id: e?._id,
          createdBy: {
            id: e.createdBy,
            name:
              e.users[0]?.personalDetails.firstName +
              ' ' +
              (e.users[0]?.personalDetails.lastName || ''),
          },
        })),
        fieldDetails: item.fieldDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
        farmerDetails: item.farmers.map((f: any) => ({...f, id: f._id}))[0]
      };
    });
    return JSON.parse(JSON.stringify(result[0]));
  } catch (e) {
    console.log('ERROR in poultryDetailsViewQuery:postProcess', e);
  }
};
