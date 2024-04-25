import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import dayjs from 'dayjs';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';

const POULTRY_SCHEMA_ID = model2schemaId('poultrybatches');
const PoultryApi = MongoAdapter.getModel(POULTRY_SCHEMA_ID);

export const poultryListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await PoultryApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { poultryId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'poultryId',
        foreignField: 'poultryId',
        pipeline: [
          {
            $match:
              { active: true }
          }
        ],
        as: 'oldPlan',
      },
    },
    {// accomodate new reference link for poultry
      $lookup: {
        from: model2collection('plans'),
        localField: 'poultryId',
        foreignField: 'poultrybatchId',
        pipeline: [
          {
            $match:
              { active: true }
          }
        ],
        as: 'plan',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'poultryId',
        foreignField: 'poultryId',
        as: 'events',
        pipeline: [
          { $match: { status: { $ne: 'archived' } } },
          { $addFields: { sortDate: { $toDate: '$createdAt' } } },
          { $sort: { sortDate: -1 } },
        ],
      },
    },

    {
      $project: {
        oldPlan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
        plan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
        poultryId: 1,
        batchIdName: 1,
        poultryType: 1,
        purpose: 1,
        size: 1,
        actualSize: 1,
        chickPlacementDay: 1,
        actualChickPlacementDay: 1,
        chickSource: 1,
        breed: 1,
        estHarvestDate: 1,
        productionSystem: 1,
        pop: 1,
        cumulativeMortality: 1,
        mortalityPercentage: 1,
        weightGain: 1,
        risk: 1,
        feedStock: 1,
        feedExpiry: 1,
        field: 1,
        status: 1,
        farmer: 1,
        landParcel: 1,
        active: 1,
        events: { _id: 1, name: 1, createdAt: 1, details: 1 },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};
function countOfPendingEvents(events: any[]) {
  let count = 0;
  events?.map((el) => {
    const endDate = el?.range?.end;
    if (endDate) {
      const formattedDate =
        endDate.split('/').length === 3
          ? rearrangeDateDMYToYMD(endDate)
          : endDate + 'T00:00:00.000Z';
      const eventDate = dayjs(formattedDate);

      if (
        dayjs(getDayJsMidnightISoString(dayjs())).isAfter(eventDate) &&
        el.ccp === true &&
        el.eventStatus === 'Pending'
      ) {
        count++;
      }
    }
  });

  return count;
}
const getPoultryDayMortality = (events: any[]) => {
  let totalPoultryDayMortality = 0;
  const mortalityEvents = events.filter(
    (item) =>
      item.name === 'poultryMortality' && item.details.startDate === dayjs().format('YYYY-MM-DD'),
  );
  if (mortalityEvents.length > 0) {
    mortalityEvents.map((event: any) => {
      totalPoultryDayMortality += (event.details.noOfBirds + (event.details.noOfBirdsCulled || 0));
    });
  }
  return totalPoultryDayMortality;
};
const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.poultryId,
      recentEvent: item.events[0] ? { ...item.events[0], id: item.events[0]?._id } : null,
      pendingEvents: item?.oldPlan.length > 0 ? countOfPendingEvents(
        Array.isArray(item?.oldPlan?.[0]?.events)
          ? item.oldPlan[0].events
          : [item?.oldPlan?.[0]?.events || {}],
      ) : countOfPendingEvents(
        Array.isArray(item?.plan?.[0]?.events)
          ? item.plan[0].events
          : [item?.plan?.[0]?.events || {}],
      ),
      dayMortality: getPoultryDayMortality(item.events),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in poultryListViewQuery:postProcess', e);
  }
};
