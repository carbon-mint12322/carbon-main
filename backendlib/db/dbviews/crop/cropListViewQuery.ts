import { Form } from '@rjsf/mui';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import dayjs from 'dayjs';
const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';

export const cropListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await CropApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { cropId: { $toString: '$_id' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'cropId',
        foreignField: 'cropId',
        as: 'events',
        pipeline: [
          { $match: { status: { $ne: 'archived' } } },
          { $addFields: { sortDate: { $toDate: '$createdAt' } } },
          { $sort: { sortDate: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 1,
              name: 1,
              category: 1,
              details: { name: 1 },
              createdAt: 1,
            },
          },
        ],
      },
    },

    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'cropId',
        foreignField: 'cropId',
        as: 'plans',
      },
    },
    { $addFields: { lpObjectId: { $toObjectId: '$landParcel.id' } } },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'lpObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'landParcelDetails',
      },
    },

    {
      $project: {
        cropTag: 1,
        cropId: 1,
        fbId: 1,
        name: 1,
        areaInAcres: 1,
        estimatedYieldTonnes: 1,
        actualYieldTonnes: 1,
        actualHarvestDate: 1,
        actualSowingDate: 1,
        status: 1,
        season: 1,
        otherGrowingSeason: 1,
        farmer: 1,
        landParcel: 1,
        cropType: 1,
        seedVariety: 1,
        active: 1,
        landParcelDetails: 1,
        validationWorkflowId: 1,
        plans: { events: { ccp: 1, eventStatus: 1, range: 1 } },
        events: { _id: 1, name: 1, createdAt: 1, details: 1, category: 1 },
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log("dbresult", dbResult);
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
  if (dbResult) {
    try {
      const result = dbResult.map((item: any) => ({
        ...item,
        id: item.cropId,
        recentEvent: item.events[0] ? { ...item.events[0], id: item.events[0]?._id } : null,
        events: item.events.map((e: any) => ({ ...e, id: e._id })),
        pendingEvents: countOfPendingEvents(
          Array.isArray(item?.plans?.[0]?.events)
            ? item.plans[0].events
            : [item?.plans?.[0]?.events || {}],
        ),
      }));

      return JSON.parse(JSON.stringify(result)) || [];
    } catch (e) {
      console.log('ERROR in cropListViewQuery:postProcess', e);
      return [];
    }
  } else {
    console.log('ERROR in cropListViewQuery:postProcess - dbResult is undefined or null');
    return [];
  }
};
