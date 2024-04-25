import { getModel } from '../../../backendlib/db/adapter';

const lpSchemaId = '/farmbook/landparcel';
const lpDbApi = getModel(lpSchemaId);

const updateSoilInfoOnLandParcel = async (ctx) => {
  try {
    const { logger, wf, event, session } = ctx;
    logger.debug(`Updating soil info on land parcel`);
    const { domainContextObjectId: lpId } = wf;
    const result = await lpDbApi.update(
      lpId,
      {
        soilInfo: { ...event?.data },
      },
      ctx?.session?.userId,
    );
    logger.debug('Soil info updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateSoilInfoOnLandParcel ', e);
  }
};

export default updateSoilInfoOnLandParcel;
