import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { toggleCropActivation } from '../crop/toggleCropActivation';

const logger = makeLogger('/api/.../poultrybatch/update');

const schemaId = `/farmbook/poultrybatch`;
const modelApi = getModel(schemaId);

export const updatePoultryBatch = async (
  id: string,
  mods: any,
  userId: string,
  _orgSlug?: string,
) => {
  const parsedData = await uploadFormFile(mods);
  logger.debug('Updating poultry batch in DB');
  const result = await modelApi.update(id, parsedData, userId);
  logger.debug('Poultry batch object updated');
  const { active } = parsedData as any;

  // if crop's activation status is updated
  if (typeof active === 'boolean') {
    //
    await toggleCropActivation({
      orgSlug: _orgSlug || '',
      userId,
      cropIds: [id],
      activationStatus: active,
      entityType: 'poultry'
    });
  }
  return result;
};
