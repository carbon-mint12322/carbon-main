import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../farmer/create');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);

export const createFarmerOSP = async (data: any, parentId: string) => {
  const farmer = await modelApi.get(parentId);

  if (!farmer) {
    throw new Error('No farmer found.');
  }

  if (farmer.osps) {
    farmer.osps.forEach((osp: any) => {
      if (osp.year === data.year && osp.landParcel.id === data.landParcel.id) {
        throw new Error('A farmer OSP already exists with this OSP year and Land Parcel.');
      }
    });
  }

  logger.debug('Creating new farmer osp in DB');
  const result = await modelApi.add(
    parentId,
    {
      osps: data,
    },
    data.createdBy,
  );
  logger.debug('Farmer OSP object created');
  return { ...result, upsertedId: data._id };
};
