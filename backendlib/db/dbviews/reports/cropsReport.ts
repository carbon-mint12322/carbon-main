import { stringDateFormatter } from '~/utils/dateFormatter';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

export const cropReportQuery = async (filter = {}, options?: any) => {
  const dbResult = await CropApi.aggregate([
    { $match: filter },
    { $addFields: { cropId: { $toString: '$_id' } } },
    { $addFields: { collectiveObjectId: { $toObjectId: '$collective' } } },
    { $addFields: { farmerObjectId: { $toObjectId: '$farmer.id' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'farmers',
      },
    },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectiveObjectId',
        foreignField: '_id',
        as: 'collectives',
      },
    },
    {
      $project: {
        cropTag: 1,
        name: 1,
        areaInAcres: 1,
        plannedSowingDate: 1,
        actualSowingDate: 1,
        estHarvestDate: 1,
        actualHarvestDate: 1,
        estimatedYieldTonnes: 1,
        actualYieldTonnes: 1,
        estimatedPopulation: 1,
        category: 1,
        season: 1,
        cropType: 1,
        seedVariety: 1,
        seedSource: 1,
        costOfCultivation: 1,
        climateScore: 1,
        complianceScore: 1,
        landParcel: {
          name: 1,
        },
        farmer: 1,
        farmers: {
          fbId: 1,
          operatorDetails: {
            farmerID: 1,
          },
        },
        collectives: {
          name: 1,
        },
        active: 1,
        createdAt: 1,
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  if (dbResult) {
    try {
      const result = dbResult.map((item: any) => ({
        ...item,
        farmer: {
          ...(item.farmer || {}),
          ...(item.farmers?.[0] || {}),
          farmerID: item.farmers?.[0]?.operatorDetails?.farmerID
            ? item.farmers?.[0]?.operatorDetails?.farmerID
            : item.farmers?.[0]?.fbId,
        },
        active: item.active ? 'Active' : 'Deactive',
        collective: item?.collectives?.[0]?.name,
        createdAt: stringDateFormatter(item.createdAt),
      }));

      return JSON.parse(JSON.stringify(result)) || [];
    } catch (e) {
      console.log('ERROR in cropReportQuery:postProcess', e);
      return [];
    }
  } else {
    console.log('ERROR in cropReportQuery:postProcess - dbResult is undefined or null');
    return [];
  }
};
