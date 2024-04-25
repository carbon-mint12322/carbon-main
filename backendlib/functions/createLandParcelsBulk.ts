import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../landparcel/create');

const schemaId = `/farmbook/landparcel`;
const modelApi = getModel(schemaId);
const lpFarmerSchema = '/farmbook/landparcel_farmer';
const LpFarmerApi = getModel(lpFarmerSchema);
const farmerSchema = '/farmbook/farmer';
const FarmerApi = getModel(farmerSchema);

export const createLandParcelsBulk = async (bulkData: any, userId: string) => {
  return bulkData.requestData.map(async (data: any) => {
    const landParcelData = {
      name: data?.name?.toString() || '',
      surveyNumber: data?.surveyNumber?.toString() || 'NA',
      passbookNumber: data?.passbookNumber?.toString() || 'NA',
      areaInAcres: parseFloat(data?.areaInAcres),
      landOwner: {
        firstName: data?.landOwner_firstName?.toString() || '',
        lastName: data?.landOwner_lastName?.toString() || '',
        primaryPhone: data?.landOwner_primaryPhone?.toString() || '',
        identityDetails: {
          identityNumber: data?.landOwner_identityNumber?.toString() || '',
          identityDocument: 'Aadhar',
        },
        address: {
          mandal: data?.address_mandal?.toString() || '',
          village: data?.address_village?.toString() || '',
          state: data?.address_state?.toString() || '',
          pincode: data?.address_pincode?.toString() || '',
        },
      },
      address: {
        mandal: data?.address_mandal?.toString() || '',
        village: data?.address_village?.toString() || '',
        state: data?.address_state?.toString() || '',
        pincode: data?.address_pincode?.toString() || '',
      },
      adjacentLands: {
        north: data?.adjacentLands_north?.toString() || '',
        east: data?.adjacentLands_east?.toString() || '',
        west: data?.adjacentLands_west?.toString() || '',
        south: data?.adjacentLands_south?.toString() || '',
      },
      map: data?.map || "",
      location: { lat: data?.latitude, lng: data?.longitude },
      climateScore: 0,
      complianceScore: 0,
      status: 'Draft',
    };


    if (!data?.landOwner_primaryPhone) {
      delete landParcelData?.landOwner?.primaryPhone
    }



    const lpInput = {
      ...landParcelData,
      collective: bulkData.collective.id,
      fbId: generateLocalId(bulkData.collective.name, 'LP'),
    };
    logger.debug('Creating new land parcel in DB');
    const createResult = await modelApi.create(lpInput, userId);
    logger.debug('Land Parcel object created');
    // create land parcel farmer relationship







    if (data.farmer_identityNumber) {
      const farmer = await FarmerApi.getByFilter({
        'personalDetails.identityDetails.identityNumber': data.farmer_identityNumber.toString(),
      });
      logger.debug('Creating new land parcel - farmer relation in DB');
      await LpFarmerApi.create(
        {
          farmer: farmer._id?.toString(),
          landParcel: createResult.insertedId?.toString(),
          own: data.own ? (data.own === 'TRUE' || data.own.toLowerCase() == "own" ? true : false) : true,
        },
        userId,
      );
      logger.debug('Land Parcel - Farmer relation object created');
    }

    if (data.farmerID) {
      const farmer = await FarmerApi.getByFilter({
        'operatorDetails.farmerID': data.farmerID.toString(),
      });
      logger.debug('Creating new land parcel - farmer relation in DB');
      await LpFarmerApi.create(
        {
          farmer: farmer._id?.toString(),
          landParcel: createResult.insertedId?.toString(),
          own: data.own ? (data.own === 'TRUE' || data.own.toLowerCase() == "own" ? true : false) : true,
        },
        userId,
      );
      logger.debug('Land Parcel - Farmer relation object created');
    }




    return createResult;
  });
};
