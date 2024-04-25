import { getModel } from '../../../backendlib/db/adapter';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const cropSchemaId = '/farmbook/crop';
const cropDbApi = getModel(cropSchemaId);

const updateCostOfCultivation = async (ctx) => {
  try {
    const { logger, wf, event } = ctx;
    const domainObjectId = ctx.wf.domainObjectId;
    logger.debug(`Updating crop's cost of cultivation`);
    const eventData = event?.data || event?.eventData;
    const { domainContextObjectId: cropId } = wf;
    let costOfCultivation = 0;
    const events = await model.list(
      { cropId, status: { $ne: 'archived' } },
      { projection: { _id: 1, details: 1 } },
    );
    if (events && events.length > 0) {
      await Promise.all(
        events.map((pEvent) => {
          if (!domainObjectId || pEvent._id.toString() !== domainObjectId.toString()) {
            costOfCultivation =
              costOfCultivation +
              (pEvent.details?.durationAndExpenses?.totalExpenditure ||
                pEvent.details?.totalExpenditure ||
                0);
          }
        }),
      );
    }
    if (event.eventName !== 'deleteRequest') {
      costOfCultivation =
        costOfCultivation +
        (eventData?.durationAndExpenses?.totalExpenditure || eventData?.totalExpenditure || 0);
    }
    const result = await cropDbApi.update(
      cropId,
      {
        costOfCultivation,
      },
      ctx?.session?.userId,
    );
    logger.debug('Crop cost of cultivation updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateCostOfCultivation ', e);
  }
};

export default updateCostOfCultivation;
