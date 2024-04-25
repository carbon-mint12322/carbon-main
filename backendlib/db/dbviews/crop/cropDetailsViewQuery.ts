const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

export const cropDetailsViewQuery = async (cropId: any) => {
  const dbResult = await CropApi.aggregate([
    { $match: { _id: new ObjectId(cropId) } },
    { $addFields: { cropId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'cropId',
        foreignField: 'cropId',
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
      $lookup: {
        from: model2collection('plans'),
        localField: 'cropId',
        foreignField: 'cropId',
        pipeline: [{ $match: { active: true } }],
        as: 'plan',
      },
    },
    { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'fieldObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'fieldDetails',
      },
    },
    { $addFields: { plotObjectId: { $toObjectId: '$plot' } } },
    {
      $lookup: {
        from: model2collection('plots'),
        localField: 'plotObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'plotDetails',
      },
    },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel.id' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelDetails',
      },
    },
    {
      $project: {
        cropTag: 1,
        cropId: 1,
        fbId: 1,
        field: 1,
        pop: 1,
        name: 1,
        cropType: 1,
        seedVariety: 1,
        seedSource: 1,
        areaInAcres: 1,
        croppingSystem: 1,
        plot: 1,
        masterCrop: 1,
        category: 1,
        season: 1,
        otherGrowingSeason: 1,
        estimatedPopulation: 1,
        estimatedYieldTonnes: 1,
        actualYieldTonnes: 1,
        plannedSowingDate: 1,
        actualSowingDate: 1,
        estHarvestDate: 1,
        actualHarvestDate: 1,
        costOfCultivation: 1,
        farmer: 1,
        landParcel: 1,
        climateScore: 1,
        complianceScore: 1,
        status: 1,
        documents: 1,
        history: 1,
        nutritionRequirements: 1,
        validationWorkflowId: 1,
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
          photosData: { filename: 1, metadata: 1 },
        },
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        fieldDetails: { _id: 1, map: 1, location: 1, fbId: 1 },
        plotDetails: { _id: 1, map: 1, fieldName: 1, area: 1 },
        landParcelDetails: { _id: 1, map: 1, location: 1 },
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
        name: any;
        range: { start: any; end: any };
        details: { createdAt: any; createdBy: any; photoRecords: any };
      }[] = [];
      const transformedEvents = item.events.map((event: any) => {
        if (event.category === 'Crop') {
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
          return event;
        } else {
          const markers: any[] = [
            { position: { lat: event.location?.lat, lng: event.location?.lng } },
          ];
          event.photosData?.map(async (photo: any) => {
            markers.push({
              position: {
                lat: photo.metadata?.location?.lat,
                lng: photo.metadata?.location?.lng,
              },
            });
          });
          return { ...event, markers };
        }
      });
      return {
        ...item,
        id: item.cropId,
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
        events: transformedEvents.map((e: any) => ({
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
        fieldDetails: item.fieldDetails.map((f: any) => ({ ...f, id: f._id }))[0],
        plotDetails: item.plotDetails.map((p: any) => ({ ...p, id: p._id }))[0],
        landParcelDetails: item.landParcelDetails.map((l: any) => ({ ...l, id: l._id }))[0],
      };
    });

    return JSON.parse(JSON.stringify(result[0]));
  } catch (e) {
    console.log('ERROR in cropDetailsViewQuery:postProcess', e);
  }
};
