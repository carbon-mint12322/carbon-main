import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { ObjectId } from 'mongodb';

const logger = makeLogger('/api/.../farmer/update');

const schemaId = `/farmbook/farmer`;
const modelApi = getModel(schemaId);
const userSchemaId = `/farmbook/user`;
const userModelApi = getModel(userSchemaId);

const updateMany = async (mods: any, userId: string) => {
  let arrayOfIds: Array<object> = [];
  mods.ids?.map((id: string) => {
    arrayOfIds.push(new ObjectId(id));
  });
  return await modelApi.updateMany({ _id: { $in: [...arrayOfIds] } }, mods.payload, userId);
};

export const updateFarmer = async (id: string, mods: any, userId: string) => {
  const parsedData = await uploadFormFile(mods);
  logger.debug('Updating farmer(s) in DB');
  const result =
    mods.operation && mods.operation === 'bulk'
      ? await updateMany(mods, userId)
      : await updateFarmerAndUser({ id, parsedData, userId })

  logger.debug('Farmer object(s) updated');
  return result;
};


const updateFarmerAndUser = async ({ id, parsedData, userId }: any) => {
  const updatedFarmer = await modelApi.update(id, parsedData, userId);
  const currentFarmer = await modelApi.get(id)
  if (!currentFarmer?.userId) {
    logger.debug(`no user found for farmer : ${currentFarmer.personalDetails.primaryPhone}`)
    return updatedFarmer
  }

  const { _id, ...currentUser } = await userModelApi.get(currentFarmer.userId)
  let userPayload = { ...currentUser }
  if (parsedData?.personalDetails) {
    userPayload.personalDetails = parsedData.personalDetails
  }
  await userModelApi.update(_id.toString(), userPayload, userId)
  return updatedFarmer

}
