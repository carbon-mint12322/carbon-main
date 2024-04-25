import { getModel } from '../../../backendlib/db/adapter';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const poultrySchemaId = '/farmbook/poultrybatches';
const PoultryDbApi = getModel(poultrySchemaId);

const updatePoultryYield = async (ctx) => {
  try {
    const { logger, wf, event, domainObject } = ctx;
    const eventData = event?.data || event?.eventData;
    logger.debug('Updating poultry yield');
    const { domainContextObjectId: poultryId } = wf;
    const domainObjectId = ctx.wf.domainObjectId;
    const poultryDetails = await PoultryDbApi.getByFilter({ _id: new ObjectId(poultryId) });
    let actualYield = 0;
    let costOfCultivation = 0;
    let actualHarvestDate = poultryDetails.actualHarvestDate || '';
    const events = await model.list(
      { poultryId, status: { $ne: 'archived' } },
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
            if (pEvent.details?.noOfBirds && pEvent.name === 'poultryHarvest')
              actualYield = actualYield + pEvent.details?.noOfBirds;
          }
        }),
      );
    }
    // update cost of cultivation and actual yield
    if (event.eventName == 'poultryHarvest' || event.eventName == 'update') {
      costOfCultivation = costOfCultivation + (eventData?.totalExpenditure || 0);
      actualYield = actualYield + eventData?.noOfBirds;
    }
    // remove actual harvest date on poultry for event delete
    if (event.eventName == 'deleteRequest') {
      const datesArray = actualHarvestDate.split(', ');
      const filteredDatesArray = datesArray.filter((date) => date !== eventData?.startDate);
      actualHarvestDate =
        filteredDatesArray.length > 1
          ? filteredDatesArray.join(', ')
          : filteredDatesArray.toString();
    }
    // add harvest date
    if (event.eventName === 'poultryHarvest') {
      actualHarvestDate =
        actualHarvestDate != ''
          ? actualHarvestDate.concat(', ').concat(eventData?.startDate)
          : eventData?.startDate;
    }
    // update harvest date
    if (
      event.eventName == 'update' &&
      actualHarvestDate.includes(domainObject?.details?.startDate)
    ) {
      actualHarvestDate = actualHarvestDate.replace(
        domainObject?.details?.startDate,
        eventData?.startDate,
      );
    }

    const result = await PoultryDbApi.update(
      poultryId,
      {
        actualYieldSize: actualYield,
        actualYieldTonnes: (actualYield * eventData.averageWeight / 1000).toFixed(2),
        actualHarvestDate: actualHarvestDate,
        costOfCultivation: costOfCultivation,
      },
      ctx?.session?.userId,
    );
    logger.debug('Poultry yield updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updatePoultryYield ', e);
  }
};

export default updatePoultryYield;
