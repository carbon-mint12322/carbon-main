const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { intersection } from 'lodash';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const farmerDetailsMobileQuery = async (userId: any, roles: any) => {
  const isProcessor = intersection(roles, ['PROCESSOR']).length !== 0;
  try {
    const dbResult = await FarmerApi.aggregate([
      { $match: { userId: userId } },
      { $match: { active: true } },
      { $addFields: { farmerId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: model2collection('landparcel_farmers'),
          localField: 'farmerId',
          foreignField: isProcessor ? 'processor' : 'farmer',
          pipeline: [{ $match: { active: true } }],
          as: 'landParcelFarmers',
        },
      },
      {
        $addFields: {
          landParcelFarmers: {
            $map: {
              input: '$landParcelFarmers',
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
          localField: 'landParcelFarmers.landParcel',
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
                from: model2collection('productionsystems'),
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
                      foreignField: 'productionSystemId',
                      pipeline: [
                        { $match: { active: true, category: 'Submission' } },
                        { $sort: { createdAt: -1 } },
                      ],
                      as: 'productionSystemEvents',
                    },
                  },
                ],
                as: 'productionSystems',
              },
            },
            // processing systems
            {
              $lookup: {
                from: model2collection('processingsystems'),
                localField: 'lpId',
                foreignField: 'landParcel',
                pipeline: [
                  { $match: { active: true } },
                  {
                    $addFields: {
                      fieldObjectId: { $toObjectId: '$field' },
                      psid: { $toString: '$_id' },
                    },
                  },
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
                      localField: 'psid',
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
        $lookup: {
          from: model2collection('productionsystems'),
          localField: 'landParcelId',
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
          ],
          as: 'productionSystems',
        },
      },
      {
        $lookup: {
          from: model2collection('crops'),
          localField: 'farmerId',
          foreignField: 'farmer.id',
          as: 'crops',
          pipeline: [
            {
              $addFields: {
                fieldId: {
                  $toObjectId: '$field',
                },
                croppingSystemId: {
                  // $toObjectId: '$croppingSystem',
                  $cond: {
                    if: {
                      $regexMatch: {
                        input: '$croppingSystem',
                        regex: /^[0-9a-fA-F]{24}$/, // Check if it's a valid ObjectId format
                      },
                    },
                    then: { $toObjectId: '$croppingSystem' }, // Convert to ObjectId if it's valid
                    else: null,
                  },
                },
                cropId: {
                  $toString: '$_id',
                },
              },
            },
            { $match: { active: true } },
            {
              $lookup: {
                from: model2collection('fields'),
                localField: 'fieldId',
                foreignField: '_id',
                pipeline: [{ $match: { active: true } }],
                as: 'fields',
              },
            },
            {
              $lookup: {
                from: model2collection('events'),
                localField: 'cropId',
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
              $lookup: {
                from: model2collection('croppingsystems'),
                localField: 'croppingSystemId',
                foreignField: '_id',
                as: 'croppingSytemData',
              },
            },
          ],
        },
      },
      {
        $project: {
          userId: 1,
          farmerId: 1,
          personalDetails: 1,
          operatorDetails: 1,
          farmingExperience: 1,
          productionSystems: 1,
          landParcels: {
            _id: 1,
            name: 1,
            surveyNumber: 1,
            address: 1,
            areaInAcres: 1,
            own: 1,
            map: 1,
            productionSystems: 1,
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
            productionSystem: 1,
          },
          crops: {
            _id: 1,
            name: 1,
            areaInAcres: 1,
            estimatedYieldTonnes: 1,
            landParcel: 1,
            croppingSystem: 1,
            croppingSytemData: 1,
            costOfCultivation: 1,
            seedVariety: 1,
            seedSource: 1,
            plannedSowingDate: 1,
            actualSowingDate: 1,
            category: 1,
            cropType: 1,
            field: 1,
            fbId: 1,
            fields: {
              _id: 1,
              map: 1,
              name: 1,
              areaInAcres: 1,
              category: 1,
              landParcel: 1,
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
      farmingExperience: item.farmingExperience,
      id: item.farmerId,
      productionSystems: item.productionSystems,
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
        crops: item.crops
          .filter((c: any) => c.landParcel.id === l._id.toString())
          .map((cm: any) => ({
            ...cm,
            croppingSytemData: cm?.croppingSytemData?.[0] || {},
            cropEvents: cm.cropEvents.map((ce: any) => ({
              id: ce._id.toString(),
              ts: ce.createdAt,
              lat: ce.location?.lat,
              lng: ce.location?.lng,
              eventId: ce._id.toString(),
              cropId: ce.cropId,
              image: ce.photoRecords,
              audio: ce.audioRecords,
              notes: ce.notes,
            })),
          })),
      })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in farmerDetailsMobileQuery:postProcess', e);
  }
};
