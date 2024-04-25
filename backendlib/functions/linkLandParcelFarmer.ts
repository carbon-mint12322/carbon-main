import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../landparcel_farmer/create');

const schemaId = `/farmbook/landparcel_farmer`;
const modelApi = getModel(schemaId);

export const linkLandParcelFarmer = async (data: any, userId: string) => {
  // update existing links - deactivate
  const filter = data.requestData.farmer
    ? {
        landParcel: data.requestData.landParcel,
        active: true,
        farmer: { $exists: true },
      }
    : {
        landParcel: data.requestData.landParcel,
        active: true,
        processor: { $exists: true },
      };
  const existingLinks = await modelApi.list(filter);
  existingLinks.forEach(async (link: any) => {
    await modelApi.update(link._id.toString(), { active: false }, userId);
  });
  logger.debug('Creating new land parcel farmer/processor link in DB');
  const createResult = await modelApi.create(data.requestData, userId);
  logger.debug('Land Parcel Farmer link created');
  return createResult;
};
