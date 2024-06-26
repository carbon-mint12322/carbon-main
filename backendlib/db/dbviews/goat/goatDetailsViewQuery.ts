const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const POULTRY_SCHEMA_ID = model2schemaId('goat');
const GoatApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const goatDetailsViewQuery = async (goatId: any) => {
  const dbResult = await GoatApi.aggregate([
    { $match: { _id: new ObjectId(goatId) } },
    { $addFields: { goatId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'goatId',
        foreignField: 'goatId',
        as: 'events',
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'goatId',
        foreignField: 'goatId',
        as: 'plan',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'productionSystem',
        foreignField: 'productionSystemId',
        as: 'productionsystemevents',
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
    { $addFields: { psObjectId: { $toObjectId: '$productionSystem' } } },
    {
      $lookup: {
        from: model2collection('productionsystems'),
        localField: 'psObjectId',
        foreignField: '_id',
        as: 'productionSystems',
      },
    },
    { $addFields: { productionSystemDetails: { $arrayElemAt: ['$productionSystems', 0] } } },
    { $addFields: { fieldObjectId: { $toObjectId: '$productionSystemDetails.field' } } },
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
        goatId: 1,
        field: 1,

        tagId: 1,
        age: 1,
        breed: 1,
        gender: 1,
        goatSource: 1,
        pedigree: 1,
        productionSystem: 1,
        productionSystemDetails: 1,
        acquisitionDay: 1,

        farmer: 1,
        landParcel: 1,
        climateScore: 1,
        complianceScore: 1,
        status: 1,
        documents: 1,
        history: 1,
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
        productionsystemevents: {
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
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        fieldDetails: { _id: 1, map: 1, location: 1, fbId: 1 },
        landParcelDetails: { _id: 1, map: 1, location: 1 },
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log('DB Result for goat query', dbResult, POULTRY_SCHEMA_ID);
  return postProcess(dbResult, goatId);
};

const postProcess = (dbResult: any, goatId: any) => {
  try {
    const result = dbResult.map((item: any) => {
      const actualEvents: {
        _id: any;
        name: any;
        range: { start: any; end: any };
        details: { createdAt: any; createdBy: any; photoRecords: any };
      }[] = [];
      item.events.map((event: any) => {
        if (event.category === 'Goat') {
          const modEvent = {
            _id: event._id.toString(),
            name: event.name,
            range: {
              start: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.startDate
                : event.details?.startDate || event.details?.dateOfPurchase
                || event.details?.dateOfBirth || event.details?.dateOfVaccination
                || event.details?.dateOfFeeding || event.details?.dateOfSale || event.details?.dateOfCalving || event.details?.dateOfMilking || event.details?.dateOfWeaning,
              end: event.details?.durationAndExpenses
                ? event.details?.durationAndExpenses?.endDate
                : event.details?.endDate || event.details?.dateOfPurchase
                || event.details?.dateOfBirth || event.details?.dateOfVaccination
                || event.details?.dateOfFeeding || event.details?.dateOfSale || event.details?.dateOfCalving || event.details?.dateOfMilking || event.details?.dateOfWeaning,
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
      item.productionsystemevents.map((event: any) => {
        if (
          event.category === 'Goat Production System' &&
          event.details.goats.some((goat: any) => goat.id === goatId)
        ) {
          const modEvent = {
            _id: event._id.toString(),
            name: event.name,
            range: {
              start: event.details?.durationAndExpenses?.startDate,
              end: event.details?.durationAndExpenses?.endDate,
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
      const eventsArray = item.events || [];
      const productionSystemEventsArray = item.productionsystemevents || [];

      const mappedEvents = eventsArray.map((e: any) => ({
        ...e,
        id: e._id,
        createdBy: {
          id: e.createdBy,
          name:
            e.users[0]?.personalDetails.firstName +
            ' ' +
            (e.users[0]?.personalDetails.lastName || ''),
        },
      }));

      const filteredProductionSystemEvents = productionSystemEventsArray
        .filter(
          (event: any) =>
            event.category === 'Goat Production System' &&
            event.details.goats.some((goat: any) => goat.id === goatId),
        )
        .map((event: any) => ({
          ...event,
          id: event._id,
          createdBy: {
            id: event.createdBy,
            name: `${event.users[0]?.personalDetails.firstName} ${event.users[0]?.personalDetails.lastName || ''
              }`,
          },
        }));
      return {
        ...item,
        id: item.goatId,
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
        events: [].concat(mappedEvents, filteredProductionSystemEvents),

        productionSystemDetails: { ...item.productionSystemDetails, id: item.productionSystemDetails?._id },
        fieldDetails: item.fieldDetails.map((f: any) => ({ ...f, id: f._id })),
        landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id })),
      };
    });
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in goatDetailsViewQuery:postProcess', e);
  }
};
