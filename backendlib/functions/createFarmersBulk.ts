import { generateLocalId } from '../db/util';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import dayjs from 'dayjs';

const logger = makeLogger('/api/.../farmer/create');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);

export const createFarmersBulk = async (bulkData: any, userId: string) => {
  return bulkData.requestData.map(async (data: any) => {
    const formatedFarmerData: any = {
      personalDetails: {
        firstName: data?.firstName?.toString() || '',
        lastName: data?.lastName?.toString() || '',
        fathersHusbandsName: data?.fathersHusbandsName?.toString() || '',
        primaryPhone: data?.primaryPhone ? '+91' + data?.primaryPhone : '',
        email: data?.email?.toString() || '',
        address: {
          mandal: data?.mandal?.toString() || '',
          village: data?.village?.toString() || '',
          state: data?.state?.toString() || '',
          pincode: data?.pincode?.toString() || '',
        },
        identityDetails: {
          identityNumber: data?.identityNumber?.toString() || '',
          identityDocument: 'Aadhar',
        },
      },
      farmingExperience: {
        totalFarmingExperienceYears: parseInt(data?.totalFarmingExperienceYears) || 0,
        organicFarmingExperienceYears: parseInt(data?.organicFarmingExperienceYears) || 0,
        cropsWithOrganicFarmingExperience: data?.cropsWithOrganicFarmingExperience || '',
        livestockExperience: data?.livestockExperience || '',
        agriAlliedActivitiesExperience: data?.agriAlliedActivitiesExperience || '',
      },
      gender: data?.gender || 'Male',
      dob: data?.dob?.toString() || '',
      operatorDetails: {
        farmerID: data?.farmerID?.toString() || '',
        joiningDate: dayjs(data?.joiningDate?.toString()).format('YYYY-MM-DD') || '',
      },
      bankDetails: {
        name: data?.bankName?.toString() || '',
        branch: data?.branch?.toString() || '',
        accountNumber: data?.accountNumber?.toString() || '',
        ifsc: data?.ifsc?.toString() || '',
      },
    };



    if (!data?.primaryPhone) {
      delete formatedFarmerData?.personalDetails?.primaryPhone
    }

    if (!data?.email) {
      delete formatedFarmerData?.personalDetails?.email
    }

    if (!data?.dob) {
      delete formatedFarmerData?.dob
    }




    if (!data?.bankName) {
      delete formatedFarmerData?.bankDetails?.name
    }




    if (!data?.accountNumber) {
      delete formatedFarmerData?.bankDetails?.accountNumber
    }

    if (!data?.branch) {
      delete formatedFarmerData?.bankDetails?.branch
    }

    if (!data?.ifsc) {
      delete formatedFarmerData?.bankDetails?.ifsc
    }

    if (!data?.cropsWithOrganicFarmingExperience) {
      delete formatedFarmerData?.farmingExperience?.cropsWithOrganicFarmingExperience
    }





    const farmerInput = {
      ...formatedFarmerData,
      collectives: [bulkData.collective.id],
      fbId: generateLocalId(bulkData.collective.name, 'FR'),
      status: 'Draft',
      type: 'Farmer',
    };
    logger.debug('Creating new user for the farmer in DB');
    const userResult = await userModelApi.create(
      {
        personalDetails: farmerInput.personalDetails,
        roles: { [bulkData.collective.slug]: ['FARMER'], farmbook: ['FARMER'] },
        status: 'Draft',
      },
      userId,
    );
    logger.debug('Farmer user object created');
    logger.debug('Creating new farmer in DB');
    const createResult = await modelApi.create(
      {
        ...farmerInput,
        userId: userResult.insertedId.toString(),
      },
      userId,
    );
    logger.debug('Farmer object created');
    return createResult;
  });
};
