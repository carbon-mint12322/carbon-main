import { stringDateFormatter } from '~/utils/dateFormatter';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const farmerReportQuery = async (filter = {}, options?: any) => {
  const dbResult = await FarmerApi.aggregate([
    { $match: filter },
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
        from: model2collection('crops'),
        localField: 'farmerId',
        foreignField: 'farmer.id',
        pipeline: [{ $match: { active: true } }],
        as: 'crops',
      },
    },
    {
      $addFields: {
        agentsObjectIds: {
          $map: {
            input: '$agents',
            as: 'agentId',
            in: { $toObjectId: '$$agentId' },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('agents'),
        localField: 'agentsObjectIds',
        foreignField: '_id',
        as: 'agentsDetails',
      },
    },
    // {
    //   $lookup: {
    //     from: model2collection('agents'),
    //     let: {
    //       agentsIds: {
    //         $map: { input: '$agents', as: 'agent', in: { $toObjectId: '$$agent' } },
    //       },
    //     },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $ne: ['$$agentsIds', null] },
    //         },
    //       },
    //       { $match: { $expr: { $in: ['$_id', '$$agentsIds'] } } },
    //     ],
    //     as: 'agentsDetails',
    //   },
    // },
    {
      $addFields: {
        collectiveObjectIds: {
          $map: {
            input: '$collectives',
            as: 'collectiveObjectId',
            in: { $toObjectId: '$$collectiveObjectId' },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectiveObjectIds',
        foreignField: '_id',
        as: 'collectivesData',
      },
    },
    {
      $project: {
        personalDetails: {
          firstName: 1,
          lastName: 1,
          fathersHusbandsName: 1,
          primaryPhone: 1,
          address: {
            village: 1,
            mandal: 1,
            state: 1,
            pincode: 1,
          },
          identityDetails: {
            identityNumber: 1,
            panCardNumber: 1,
          },
        },
        landParcels: { name: 1 },
        crops: {
          name: 1,
        },
        gender: 1,
        dob: 1,
        farmingExperience: {
          totalFarmingExperienceYears: 1,
          organicFarmingExperienceYears: 1,
          cropsWithOrganicFarmingExperience: 1,
          livestockExperience: 1,
          agriAlliedActivitiesExperience: 1,
        },
        operatorDetails: {
          farmerID: 1,
        },
        collectivesData: {
          name: 1,
        },
        active: 1,
        agentsDetails: 1,
        personalOrgDetails: 1,
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
      id: item.farmerId,
      name: item.personalDetails?.firstName + ' ' + item.personalDetails?.lastName,
      crops: item.crops.map((c: any) => c.name).join(', '),
      collective: item.collectivesData.map((c: any) => c?.name).join(', '),
      active: item.active ? 'Active' : 'Deactive',
      landParcels: item.landParcels.map((l: any) => l?.name).join(', '),
      address: item.personalDetails.address,
      identityDetails: item.personalDetails.identityDetails,
      createdAt: stringDateFormatter(item.createdAt),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in farmerReportQuery:postProcess', e);
  }
};
