import reschedulePlanEventsBySowingDate from '~/backendlib/crop/plan/reschedulePlanEventsBySowingDate';
import { getModel } from '~/backendlib/db/adapter';
import {
  fetchPlanByCtx,
  findSowingEventInPlanEvents,
  getFormattedRange,
} from '~/backendlib/helpers';
import { PlanEventInputParams, PlanEventT } from '~/backendlib/types';

const CollectiveSchemaId = '/farmbook/collective';
const CollectiveModelApi = getModel(CollectiveSchemaId);

const CropModelApi = getModel('/farmbook/crop');

export default async function adjustPlanEventsBySowingDateDifference(ctx: any) {
  const inputParams = await getInputParams(ctx);
  //   console.log({ inputParams: JSON.stringify({ inputParams }) });

  // updating actual sowing date
  await updateActualSowingDate({
    userId: inputParams.userId,
    cropId: inputParams.cropId,
    actualSowingStartDate: ctx.event?.data?.durationAndExpenses?.startDate,
  });

  if (inputParams.selectedPlanEvent) {
    if (inputParams.selectedPlanEvent.range.start !== inputParams.newSowingStartDate) {
      await reschedulePlanEventsBySowingDate(inputParams);
    }
  }

  return ctx;
}

/** */
async function getInputParams(ctx: any): Promise<PlanEventInputParams> {
  const { wf } = ctx;
  const { domainContextObjectId: cropId } = wf;
  const plan = await fetchPlanByCtx(ctx);

  const defaultValues = { ccp: false, eventStatus: 'Completed' };
  const sowingEvent = findSowingEventInPlanEvents(plan?.events);

  let selectedPlanEvent;
  if (sowingEvent) {
    selectedPlanEvent = {
      // adding default values, as they might not be available in old schedule events
      ...defaultValues,
      ...sowingEvent,
    };
  }

  const { newSowingStartDate, newSowingEndDate } = getSowingEventDates(ctx);

  // const eventPlanToUpdate = {
  //   ...selectedPlanEvent,
  //   range: {
  //     start: newSowingStartDate,
  //     end: newSowingEndDate,
  //   },
  // };

  return {
    cropId,
    orgSlug: await getOrgSlugByCtx(ctx),
    plan,
    selectedPlanEvent: selectedPlanEvent,
    eventPlanToUpdate: selectedPlanEvent,
    userId: getUserIdByCtx(ctx),
    newSowingStartDate,
    newSowingEndDate,
    ccp: selectedPlanEvent ? selectedPlanEvent?.ccp || false : false,
    eventStatus: selectedPlanEvent ? selectedPlanEvent?.eventStatus || 'Pending' : 'Pending',
  };
}

/** */
/** */
async function updateActualSowingDate({
  userId,
  cropId,
  actualSowingStartDate,
}: {
  userId: string;
  cropId?: string;
  actualSowingStartDate: string;
}): Promise<boolean> {
  if (!cropId) throw new Error('Crop id not valid');
  if (!actualSowingStartDate) throw new Error('newSowingStartDate not valid');
  if (!userId) throw new Error('userId not valid');

  return CropModelApi.update(cropId, { actualSowingDate: actualSowingStartDate }, userId);
}

/**
 * Convert to DD/MM/YYYY format if it's in YYYY-MM-DD format
 *
 */
function getSowingEventDates(ctx: any): {
  newSowingStartDate: string;
  newSowingEndDate: string;
} {
  try {
    const {
        event: {
          data: {
            durationAndExpenses: { startDate, endDate },
          },
        },
    } = ctx;
    if (!startDate || !endDate)
      throw new Error(
        'Sowing event dates are not valid. Params : ' +
          JSON.stringify({
            startDate,
            endDate,
          }),
      );

    const { start, end } = getFormattedRange({
      range: {
        start: startDate,
        end: endDate,
      },
    });

    return {
      newSowingStartDate: start,
      newSowingEndDate: end,
    };
  } catch (e) {
    console.log('Error when trying to get sowing event startDate', e);
    throw e;
  }
}

/** */
function getUserIdByCtx(ctx: any) {
  try {
    const { session } = ctx;

    const userId = session.userId || false;

    if (!userId) throw new Error('User Id not valid. Params: ' + JSON.stringify({ session }));

    return userId;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/** */
async function getOrgSlugByCtx(ctx: any): Promise<string> {
  const {
    domainContextObject: { collective: collectiveId },
  } = ctx;
  if (!collectiveId) throw new Error('Collective Id not valid');

  const collectiveModel = await CollectiveModelApi.get(collectiveId);

  const orgSlug = collectiveModel.slug;

  if (!orgSlug) throw new Error('Org slug not valid');

  return orgSlug;
}
