const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);

export const landParcelListViewQuery = async (
  filter = {},
  collectiveId?: string,
  options?: any,
) => {
  const dbResult = await LPApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true, status: { $ne: 'Completed' } } }],
        as: 'crops',
      },
    },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        as: 'landParcelFarmers',
        pipeline: [
          {
            $match: { active: true },
          },
        ],
      },
    },
    { $addFields: { landParcelFarmer: { $arrayElemAt: ['$landParcelFarmers', 0] } } },
    { $addFields: { farmerObjectId: { $toObjectId: '$landParcelFarmer.farmer' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'farmer',
      },
    },
    {
      $project: {
        landParcelId: 1,
        name: 1,
        areaInAcres: 1,
        climateScore: 1,
        complianceScore: 1,
        address: 1,
        surveyNumber: 1,
        map: 1,
        location: 1,
        active: 1,
        status: 1,
        solarDryerUnits: 1,
        compostingUnits: 1,
        landParcelFarmer: 1,
        farmer: {
          _id: 1,
          personalDetails: { firstName: 1, lastName: 1 },
          personalOrgDetails: { identificationNumber: 1 },
        },
        crops: { _id: 1, name: 1 },
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
      id: item.landParcelId,
      crops: item.crops.map((c: any) => ({ ...c, id: c._id })),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in landParcelListViewQuery:postProcess', e);
  }
};
