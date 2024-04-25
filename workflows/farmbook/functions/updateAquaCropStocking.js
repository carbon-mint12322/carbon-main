import { getModel } from '../../../backendlib/db/adapter';

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const aquacropSchemaId = '/farmbook/aquacrop';
const AquaCropDbApi = getModel(aquacropSchemaId);

const updateAquaCropStocking = async (ctx) => {
  try {
    const { logger, wf, event } = ctx;
    logger.debug(`Updating aquaculture crop stocking`);
    const { domainContextObjectId: aquacropId } = wf;
    const eventData = event?.data || event?.eventData;
    let actualStockingDate;
    if (event.eventName !== 'deleteRequest') {
      actualStockingDate = eventData.stockingDate;
    }
    const result = await AquaCropDbApi.update(
      aquacropId,
      {
        actualStockingDate,
      },
      ctx?.session?.userId,
    );
    logger.debug('Aquaculture crop stocking updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateAquaCropStocking ', e);
  }
};

export default updateAquaCropStocking;
