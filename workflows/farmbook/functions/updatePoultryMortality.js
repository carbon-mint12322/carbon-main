import { getModel } from '../../../backendlib/db/adapter';

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const poultrySchemaId = '/farmbook/poultrybatches';
const PoultryDbApi = getModel(poultrySchemaId);

const updatePoultryMortality = async (ctx) => {
  try {
    const { logger, wf, event, domainContextObject } = ctx;
    const domainObjectId = ctx.wf.domainObjectId;
    logger.debug(`Updating poultry mortality`);
    const { domainContextObjectId: poultryId } = wf;
    const eventData = event?.data || event?.eventData;
    let cumulativeMortality = 0;
    const events = await model.list(
      { poultryId, status: { $ne: 'archived' }, name: 'poultryMortality' },
      { projection: { _id: 1, details: 1 } },
    );
    if (events && events.length > 0) {
      await Promise.all(
        events.map((pEvent) => {
          if (!domainObjectId || pEvent._id.toString() !== domainObjectId.toString()) {
            cumulativeMortality = cumulativeMortality + (pEvent.details?.noOfBirds || 0) + (pEvent.details?.noOfBirdsCulled || 0);
          }
        }),
      );
    }
    if (event.eventName !== 'deleteRequest') {
      cumulativeMortality = cumulativeMortality + (eventData?.noOfBirds || 0) + (eventData?.noOfBirdsCulled || 0);
    }
    const result = await PoultryDbApi.update(
      poultryId,
      {
        cumulativeMortality,
        mortalityPercentage: (cumulativeMortality / domainContextObject.size) * 100,
      },
      ctx?.session?.userId,
    );
    logger.debug('Poultry mortality updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updatePoultryMortality ', e);
  }
};

export default updatePoultryMortality;
