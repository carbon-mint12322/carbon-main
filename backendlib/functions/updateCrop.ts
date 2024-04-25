import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { toggleCropActivation } from '../crop/toggleCropActivation';

const logger = makeLogger('/api/.../crop/update');

const schemaId = `/farmbook/crop`;
const modelApi = getModel(schemaId);

export const updateCrop = async (id: string, mods: any, userId: string, _orgSlug?: string) => {
  const parsedData: any = await uploadFormFile(mods);
  logger.debug('Updating crop in DB');

  // Assuming your current data has a field 'fbId' with a separator '-'
  if (parsedData && parsedData?.fbId) {
    const fbIdParts = parsedData?.fbId.split('-');
    // Ensure there is at least one part before modifying
    if (fbIdParts.length > 1) {
      fbIdParts[fbIdParts.length - 1] = parsedData.cropTag;
      parsedData.fbId = fbIdParts.join('-');
    }
  }

  const result = await modelApi.update(id, parsedData, userId);

  logger.debug('Crop object updated');
  const { active } = parsedData as any;

  // if crop's activation status is updated
  if (typeof active === 'boolean') {
    //
    await toggleCropActivation({
      orgSlug: _orgSlug || '',
      userId,
      cropIds: [id],
      activationStatus: active,
    });
  }
  return result;
};
