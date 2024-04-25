import { stringDateFormatter } from '~/utils/dateFormatter';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);

export const landParcelReportQuery = async (filter = {}, options?: any) => {
  const dbResult = await LPApi.aggregate([
    { $match: filter },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true } }],
        as: 'crops',
      },
    },
    { $addFields: { collectiveObjectId: { $toObjectId: '$collective' } } },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectiveObjectId',
        foreignField: '_id',
        as: 'collectives',
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
        name: 1,
        surveyNumber: 1,
        areaInAcres: 1,
        calculatedAreaInAcres: 1,
        passbookNumber: 1,
        address: {
          village: 1,
          mandal: 1,
          state: 1,
          pincode: 1,
        },
        landOwner: {
          firstName: 1,
          lastName: 1,
          fathersHusbandsName: 1,
          primaryPhone: 1,
          identityDetails: {
            identityNumber: 1,
            panCardNumber: 1,
          },
        },
        climateScore: 1,
        complianceScore: 1,
        farmer: {
          personalDetails: { firstName: 1, lastName: 1 },
        },
        active: 1,
        crops: { name: 1 },
        collectives: {
          name: 1,
        },
        createdAt: 1,
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
      crops: item.crops.map((c: any) => c.name).join(', '),
      farmers: item.farmer
        .map((a: any) => a.personalDetails.firstName + ' ' + a.personalDetails.lastName)
        .join(', '),
      active: item.active ? 'Active' : 'Deactive',
      collective: item.collectives[0].name,
      createdAt: stringDateFormatter(item.createdAt),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in landParcelReportQuery:postProcess', e);
  }
};
