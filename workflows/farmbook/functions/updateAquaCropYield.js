import { getModel } from '../../../backendlib/db/adapter';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const domainSchema = '/farmbook/event';
const model = getModel(domainSchema);
const aquacropSchemaId = '/farmbook/aquacrop';
const AquaCropDbApi = getModel(aquacropSchemaId);

const updateAquaCropYield = async (ctx) => {
  try {
    const { logger, wf, event, domainObject } = ctx;
    const eventData = event?.data || event?.eventData;
    logger.debug('Updating aquaculture crop yield');
    const { domainContextObjectId: aquacropId } = wf;
    const domainObjectId = ctx.wf.domainObjectId;
    const aquacropDetails = await AquaCropDbApi.getByFilter({ _id: new ObjectId(aquacropId) });
    let actualYield = 0;
    let costOfCultivation = 0;
    let actualHarvestDate = aquacropDetails.actualHarvestDate || '';
    const events = await model.list(
      { aquaId: aquacropId, status: { $ne: 'archived' } },
      { projection: { _id: 1, details: 1, name: 1 } },
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
            if (pEvent.details.harvestQuantity && pEvent.name === 'aquacropHarvest')
              actualYield = actualYield + pEvent.details.harvestQuantity;
          }
        }),
      );
    }
    // update cost of cultivation and actual yield
    if (event.eventName == 'aquacropHarvest' || event.eventName == 'update') {
      costOfCultivation = costOfCultivation + (eventData.totalExpenditure || 0);
      actualYield = actualYield + eventData?.harvestQuantity;
    }
    // remove actual harvest date on aquaculture crop for event delete
    if (event.eventName == 'deleteRequest') {
      const datesArray = actualHarvestDate.split(', ');
      const filteredDatesArray = datesArray.filter((date) => date !== eventData?.startDate);
      actualHarvestDate =
        filteredDatesArray.length > 1
          ? filteredDatesArray.join(', ')
          : filteredDatesArray.toString();
    }
    // add harvest date
    if (event.eventName === 'aquacropHarvest') {
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

    const result = await AquaCropDbApi.update(
      aquacropId,
      {
        actualYieldTonnes: actualYield,
        actualHarvestDate: actualHarvestDate,
        costOfCultivation: costOfCultivation,
      },
      ctx?.session?.userId,
    );
    logger.debug('Aquaculture crop yield updated');
    return result;
  } catch (e) {
    console.log('ERROR----------> updateAquaCropYield ', e);
  }
};

export default updateAquaCropYield;
