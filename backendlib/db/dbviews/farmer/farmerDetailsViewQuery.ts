const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const farmerDetailsViewQuery = async (farmerId: any) => {
  const dbResult = await FarmerApi.aggregate([
    { $match: { _id: new ObjectId(farmerId) } },
    { $addFields: { farmerId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'farmerId',
        foreignField: 'farmer',
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
              own: '$$this.own',
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
        pipeline: [{ $match: { active: true } }],
        as: 'landParcels',
      },
    },
    {
      $lookup: {
        from: model2collection('histories'),
        let: { farmerId: '$farmerId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$relatedTo.objectId', '$$farmerId'] },
                  { $eq: ['$relatedTo.schemaId', '/farmbook/farmer'] },
                ],
              },
            },
          },
          {
            $addFields: {
              objectIdCreatedBy: {
                $toObjectId: '$createdBy',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('users'),
              localField: 'objectIdCreatedBy',
              foreignField: '_id',
              as: 'createdByUser',
            },
          },
          {
            $addFields: {
              createdByUserItem: {
                $arrayElemAt: ['$createdByUser', 0],
              },
            },
          },
          {
            $project: {
              createdBy: 0,
            },
          },
        ],
        as: 'histories',
      },
    },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'farmerId',
        foreignField: 'farmer.id',
        pipeline: [{ $match: { active: true } }],
        as: 'crops',
      },
    },
    {
      $lookup: {
        from: model2collection('schemes'),
        localField: 'farmerId',
        foreignField: 'schemeOwner',
        pipeline: [{ $match: { active: true } }],
        as: 'schemeslist',
      },
    },
    {
      $lookup: {
        from: model2collection('agents'),
        let: {
          agentsIds: {
            $map: { input: '$agents', as: 'agent', in: { $toObjectId: '$$agent' } },
          },
        },
        pipeline: [
          {
            $match: {
              $expr: { $ne: ['$$agentsIds', null] },
            },
          },
          { $match: { $expr: { $in: ['$_id', '$$agentsIds'] } } },
          {
            $project: {
              _id: 1,
              personalDetails: 1,
            },
          },
        ],
        as: 'agentsDetails',
      },
    },
    {
      $project: {
        fbId: 1,
        farmerId: 1,
        personalDetails: 1,
        personalOrgDetails: 1,
        farmingExperience: 1,
        operatorDetails: 1,
        bankDetails: 1,
        documents: 1,
        history: 1,
        gender: 1,
        dob: 1,
        status: 1,
        statusNotes: 1,
        validationWorkflowId: 1,
        landParcelFarmers: 1,
        agents: 1,
        agentsDetails: 1,
        landParcels: { _id: 1, name: 1, active: 1, surveyNumber: 1, status: 1, address: 1, areaInAcres: 1, map: 1 },
        osps: 1,
        schemes: 1,
        schemeslist: 1,
        inspectionDetails: 1,
        crops: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          croppingSystem: 1,
          seedVariety: 1,
          seedSource: 1,
          status: 1,
          landParcel: 1,
          plannedSowingDate: 1,
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
      id: item.farmerId,
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
      osps: item.osps?.map((o: any) => ({ ...o, id: o._id })),
      schemes: item.schemes?.map((s: any) => ({ ...s, id: s._id })),
      schemeslist: item.schemeslist?.map((sl: any) => ({ ...sl, id: sl._id })),
      inspectionDetails: item.inspectionDetails?.map((fi: any) => ({ ...fi, id: fi._id })),
      landParcels: item.landParcels?.map((l: any) => ({
        ...l,
        id: l._id,
        own: item.landParcelFarmers?.filter(
          (lpf: any) => l._id.toString() === lpf.landParcel.toString(),
        )[0].own,
      })),
    }));
    return JSON.parse(JSON.stringify(result[0]));
  } catch (e) {
    console.log('ERROR in farmerDetailsViewQuery:postProcess', e);
  }
};
