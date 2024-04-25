import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import dayjs from 'dayjs';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';

const AQUACROP_SCHEMA_ID = model2schemaId('aquacrop');
const AquaCropApi = MongoAdapter.getModel(AQUACROP_SCHEMA_ID);

export const aquacropListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await AquaCropApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { aquacropId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'aquacropId',
        foreignField: 'aquaId',
        as: 'aquacropPlan',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'aquacropId',
        foreignField: 'aquaId',
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
        aquacropPlan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
        aquacropId: 1,
        cropType: 1,
        cropSubType: 1,
        quantity: 1,
        plannedStockingDate: 1,
        estHarvestDate: 1,
        estimatedYieldTonnes: 1,
        seedVariety: 1,
        seedSource: 1,
        seedEvidence: 1,
        seedCertificate: 1,
        actualYieldTonnes: 1,
        actualStockingDate: 1,
        actualHarvestDate: 1,
        costOfCultivation: 1,
        risk: 1,
        field: 1,
        status: 1,
        farmer: 1,
        landParcel: 1,
        active: 1,
        events: { _id: 1, name: 1, createdAt: 1, details: 1 },
        fbId: 1,
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
const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.aquacropId,
      events: item.events.map((e: any) => ({ ...e, id: e._id })),
      pendingEvents: countOfPendingEvents(
        Array.isArray(item?.aquacropPlan?.[0]?.events)
          ? item.aquacropPlan[0].events
          : [item?.aquacropPlan?.[0]?.events || {}],
      ),
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in aquacropListViewQuery:postProcess', e);
  }
};
