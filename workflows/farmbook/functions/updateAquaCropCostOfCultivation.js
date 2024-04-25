import { getModel } from '../../../backendlib/db/adapter';

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const aquacropSchemaId = '/farmbook/aquacrop';
const AquaCropDbApi = getModel(aquacropSchemaId);

const updateAquaCropCostOfCultivation = async (ctx) => {
  try {
    const { logger, wf, event } = ctx;
    const domainObjectId = ctx.wf.domainObjectId;
    logger.debug(`Updating aquaculture crop cost of cultivation`);
    const { domainContextObjectId: aquacropId } = wf;
    const eventData = event?.data || event?.eventData;
    let costOfCultivation = 0;
    const events = await model.list(
      { aquaId: aquacropId, status: { $ne: 'archived' } },
      { projection: { _id: 1, details: 1 } },
    );
    if (events && events.length > 0) {
      await Promise.all(
        events.map((pEvent) => {
          if (!domainObjectId || pEvent._id.toString() !== domainObjectId.toString()) {
            costOfCultivation =
              costOfCultivation +
              (pEvent.details.durationAndExpenses?.totalExpenditure ||
                pEvent.details.totalExpenditure ||
                0);
          }
        }),
      );
    }
    if (event.eventName !== 'deleteRequest') {
      costOfCultivation =
        costOfCultivation +
        (eventData.durationAndExpenses?.totalExpenditure || eventData.totalExpenditure || 0);
    }
    const result = await AquaCropDbApi.update(
      aquacropId,
      {
        costOfCultivation,
      },
      ctx?.session?.userId,
    );
    logger.debug('Aquaculture crop cost of cultivation updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateAquaCropCostOfCultivation ', e);
  }
};

export default updateAquaCropCostOfCultivation;
