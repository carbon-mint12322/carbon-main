import dayjs from "dayjs";
import { scheduleNotificationsForPlan } from "~/backendlib/crop/plan/schedule";
import { getModel } from "~/backendlib/db/adapter";
import { findChickPlacementEventInPlanEvents, findSowingEventInPlanEvents, findStockingEventInPlanEvents } from "~/backendlib/helpers";
import { PlanEventInputParams, PlanEventT } from "~/backendlib/types";
import { rearrangeDateDMYToYMD } from "~/backendlib/utils";

const planSchemaId = '/farmbook/plan';
const PlanModelApi = getModel(planSchemaId);
const collectiveSchemaId = '/farmbook/collective';
const CollectiveModelApi = getModel(collectiveSchemaId);


async function updateActualDate({
  userId,
  entityId,
  entitySchema,
  mods,
}: {
  userId: string;
  entityId: string;
  entitySchema: string;
  mods: any;
}): Promise<boolean> {
  const modelApi = getModel(`/farmbook/${entitySchema}`);
  return modelApi.update(entityId, mods, userId);
}

export default async function adjustPlanEvents(ctx: any) {
  const { logger, session, wf, event, domainContextObject, domainObject } = ctx;
  logger.debug(`Adjust plan events`);
  const { domainContextObjectId: entityId, domainContextSchemaId } = wf;
  const entitySchema = domainContextSchemaId.split('/').pop();
  const mods: any = {};
  const actualStartDate = event?.data?.durationAndExpenses?.startDate;
  let mainEvent;
  let plan;
  switch (entitySchema) {
    case 'crop':
      mods['actualSowingDate'] = actualStartDate;
      plan = await PlanModelApi.getByFilter({ cropId: entityId });
      mainEvent = findSowingEventInPlanEvents(plan?.events);
      break;
    case 'poultrybatches':
      mods['actualChickPlacementDay'] = actualStartDate;
      mods['actualSize'] = event?.data?.quantity;
      plan = await PlanModelApi.getByFilter({ poultryId: entityId });
      mainEvent = findChickPlacementEventInPlanEvents(plan?.events);
      break;
    case 'poultrybatch':
      mods['actualChickPlacementDay'] = actualStartDate;
      mods['actualSize'] = event?.data?.quantity;
      plan = await PlanModelApi.getByFilter({ poultryId: entityId });
      mainEvent = findChickPlacementEventInPlanEvents(plan?.events);
      break;
    case 'aquacrop':
      mods['actualStockingDate'] = actualStartDate;
      plan = await PlanModelApi.getByFilter({ aquaId: entityId });
      mainEvent = findStockingEventInPlanEvents(plan?.events);
      break;
    default:
      break;
  }
  // updating actual date date
  await updateActualDate({
    userId: session.userId,
    entityId,
    entitySchema,
    mods,
  });

  if (plan?.events && mainEvent) {
    // override the dates if it is an update event
    if (event.eventName == 'update') {
      mainEvent = {
        ...mainEvent,
        range: {
          start: dayjs(domainObject.details.durationAndExpenses?.startDate, 'YYYY-MM-DD').format(
            'DD/MM/YYYY',
          ),
          end: dayjs(domainObject.details.durationAndExpenses?.endDate, 'YYYY-MM-DD').format(
            'DD/MM/YYYY',
          ),
        },
      };
    }

    if (mainEvent.range.start !== dayjs(actualStartDate, 'YYYY-MM-DD').format('DD/MM/YYYY')) {
      const newPlanEvents = getPlanEventsAfterFormatting({
        mainEvent,
        plan,
        newStartDate: actualStartDate,
      });

      // Updating all plan events in single query
      await PlanModelApi.update(plan._id.toString(), { events: newPlanEvents }, session.userId);

      const collective = await CollectiveModelApi.get(domainContextObject.collective);
      // Rescheduling notification for all plan events
      await scheduleNotificationsForPlan({
        userId: session.userId,
        plan: {
          _id: plan._id.toString(),
          events: newPlanEvents,
        },
        orgSlug: collective.slug,
      });
    }
  }
  return ctx;
}

function getPlanEventsAfterFormatting({
  mainEvent,
  plan,
  newStartDate,
}: any) {
  // Get old sowing start date
  const oldStartDate = mainEvent.range.start;
  const onlySelectPlanEventsAfterMainEventStartDate = (pe: PlanEventT): boolean => {
    return dayjs(rearrangeDateDMYToYMD(pe.range.start)).isAfter(
      dayjs(rearrangeDateDMYToYMD(oldStartDate)),
    );
  };

  // removing main event, as it's not going to formatted for update
  plan.events = plan.events.filter((i: PlanEventT) => !(i._id === mainEvent._id));

  // getting list of past plans, to add to bulk update
  const nonUpdatedEvents = plan.events.filter(
    (p: PlanEventT) => !onlySelectPlanEventsAfterMainEventStartDate(p),
  );

  // Removing past plans, as they are not needed to be updated
  // and shifting dates for all plan events after sowing date
  const updatedPlanEvents = plan.events
    .filter(onlySelectPlanEventsAfterMainEventStartDate)
    .map((planEvent: PlanEventT) =>
      shiftPlanEventDates({
        oldStartDate,
        newStartDate,
        planEvent,
      }),
    );

  return [...nonUpdatedEvents, mainEvent, ...updatedPlanEvents];
}

/**
 *
 * @param param0
 * @returns
 */
function shiftPlanEventDates({
  oldStartDate,
  newStartDate,
  planEvent,
}: {
  oldStartDate: string; // should be DD/MM/YYYY
  newStartDate: string; // should be DD/MM/YYYY
  planEvent: PlanEventT;
}) {
  
  const differenceStartDates = getDifferenceBetweenTwoDates(
    oldStartDate,
    newStartDate,
  );

  const newEventStartDate = getDifferenceCalculatedDate(
    planEvent.range.start,
    differenceStartDates,
  );

  const newEventEndDate = getDifferenceCalculatedDate(planEvent.range.end, differenceStartDates);

  // Returning with newly calculated dates
  return {
    ...planEvent,
    range: {
      start: newEventStartDate,
      end: newEventEndDate,
    },
  };
}

/** */
// Find difference between existing sowing date and start & end
function getDifferenceBetweenTwoDates(date1: string, date2: string): number {
  const date1Instance = dayjs(rearrangeDateDMYToYMD(date1));
  const date2Instance = dayjs(rearrangeDateDMYToYMD(date2));

  return date2Instance.diff(date1Instance, 'day');
}

// Calculating new date by difference
function getDifferenceCalculatedDate(
  date: string, // date must DD/MM/YYYY
  difference: number,
): string {
  return dayjs(rearrangeDateDMYToYMD(date)).add(difference, 'days').format('DD/MM/YYYY');
}