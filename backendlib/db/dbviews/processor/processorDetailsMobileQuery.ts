const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PROCESSOR_SCHEMA_ID = model2schemaId('farmer');
const ProcessorApi = MongoAdapter.getModel(PROCESSOR_SCHEMA_ID);

export const processorDetailsMobileQuery = async (userId: any) => {
  try {
    const dbResult = await ProcessorApi.aggregate([
      { $match: { userId: userId } },
      { $match: { active: true } },
      {
        $match: {
          $and: [
            { type: { $exists: true, $eq: 'Processor' } }, // Check if type exists and equals 'Farmer'
          ],
        },
      },
      { $addFields: { processorId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: model2collection('landparcel_farmers'),
          localField: 'processorId',
          foreignField: 'farmer',
          pipeline: [{ $match: { active: true } }],
          as: 'landParcelProcessors',
        },
      },
      {
        $addFields: {
          landParcelProcessors: {
            $map: {
              input: '$landParcelProcessors',
              in: {
                landParcel: {
                  $toObjectId: '$$this.landParcel',
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: model2collection('landparcels'),
          localField: 'landParcelProcessors.landParcel',
          foreignField: '_id',
          as: 'landParcels',
          pipeline: [
            {
              $addFields: {
                lpId: {
                  $toString: '$_id',
                },
              },
            },
            { $match: { active: true } },
            {
              $lookup: {
                from: model2collection('events'),
                localField: 'lpId',
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
                from: model2collection('processingsystems'),
                localField: 'lpId',
                foreignField: 'landParcel',
                pipeline: [
                  { $match: { active: true } },
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
                  {
                    $lookup: {
                      from: model2collection('events'),
                      localField: 'id',
                      foreignField: 'processingSystemId',
                      pipeline: [
                        { $match: { active: true, category: 'Submission' } },
                        { $sort: { createdAt: -1 } },
                      ],
                      as: 'processingSystemEvents',
                    },
                  },
                ],
                as: 'processingSystems',
              },
            },
          ],
        },
      },
      {
        $project: {
          userId: 1,
          processorId: 1,
          personalDetails: 1,
          operatorDetails: 1,
          processingExperience: 1,
          landParcels: {
            _id: 1,
            name: 1,
            surveyNumber: 1,
            address: 1,
            areaInAcres: 1,
            own: 1,
            map: 1,
            processingSystems: 1,
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
          },
        },
      },
    ]);
    // Massage the output to the desired format
    return postProcess(dbResult);
  } catch (e) {
    console.log('ERROR', e);
  }
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      userId: item.userId,
      ...item.personalDetails,
      orgDetails: item.operatorDetails,
      processingExperience: item.processingExperience,
      id: item.processorId,
      landParcels: item.landParcels.map((l: any) => ({
        ...l,
        id: l._id,
        landParcelEvents: l.landParcelEvents.map((le: any) => ({
          id: le._id.toString(),
          ts: le.createdAt,
          lat: le.location?.lat,
          lng: le.location?.lng,
          category: le.category,
          eventId: le._id.toString(),
          landParcelId: le.landParcelId,
          image: le.photoRecords,
          audio: le.audioRecords,
          notes: le.notes,
        })),
      })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in processorDetailsMobileQuery:postProcess', e);
  }
};
