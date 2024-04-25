import { getModel } from '../../../backendlib/db/adapter';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const cropSchemaId = '/farmbook/crop';
const cropDbApi = getModel(cropSchemaId);

const updateCropYield = async (ctx) => {
  try {
    const { logger, wf, event, domainObject } = ctx;
    const eventData = event?.data || event?.eventData;
    logger.debug('Updating crop yield');
    const { domainContextObjectId: cropId } = wf;
    const domainObjectId = ctx.wf.domainObjectId;
    const cropDetails = await cropDbApi.getByFilter({ _id: new ObjectId(cropId) });
    let actualYield = 0;
    let costOfCultivation = 0;
    let actualHarvestDate = cropDetails.actualHarvestDate || '';
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
            if (pEvent.details?.harvestQuantity)
              actualYield = actualYield + pEvent.details?.harvestQuantity;
          }
        }),
      );
    }
    // update cost of cultivation and actual yield
    if (event.eventName == 'harvestingEvent' || event.eventName == 'update') {
      costOfCultivation =
        costOfCultivation +
        (eventData?.durationAndExpenses?.totalExpenditure || eventData?.totalExpenditure || 0);
      actualYield = actualYield + eventData?.harvestQuantity;
    }
    // remove actual harvest date on crop for event delete
    if (event.eventName == 'deleteRequest') {
      const datesArray = actualHarvestDate.split(', ');
      const filteredDatesArray = datesArray.filter(
        (date) => date !== eventData?.durationAndExpenses?.startDate,
      );
      actualHarvestDate =
        filteredDatesArray.length > 1
          ? filteredDatesArray.join(', ')
          : filteredDatesArray.toString();
    }
    // add harvest date
    if (event.eventName === 'harvestingEvent') {
      actualHarvestDate =
        actualHarvestDate != ''
          ? actualHarvestDate.concat(', ').concat(eventData?.durationAndExpenses?.startDate)
          : eventData?.durationAndExpenses?.startDate;
    }
    // update harvest date
    if (
      event.eventName == 'update' &&
      actualHarvestDate.includes(domainObject?.details.durationAndExpenses?.startDate)
    ) {
      actualHarvestDate = actualHarvestDate.replace(
        domainObject?.details.durationAndExpenses?.startDate,
        eventData?.durationAndExpenses?.startDate,
      );
    }

    const result = await cropDbApi.update(
      cropId,
      {
        actualYieldTonnes: actualYield,
        actualHarvestDate: actualHarvestDate,
        costOfCultivation: costOfCultivation,
      },
      ctx?.session?.userId,
    );
    logger.debug('Crop yield updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateCropYield ', e);
  }
};

export default updateCropYield;
