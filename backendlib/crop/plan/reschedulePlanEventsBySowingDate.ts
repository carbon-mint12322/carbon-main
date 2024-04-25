import dayjs from 'dayjs';
import { getModel } from '~/backendlib/db/adapter';
import { PlanEventInputParams, PlanEventStatuses, PlanEventT, PlanT } from '~/backendlib/types';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import rescheduleAlreadyNotification from './rescheduleAlreadyNotification';
import { scheduleNotificationsForPlan } from './schedule';

const schemaId = '/farmbook/plans';
const PlanModelApi = getModel(schemaId);

export default async function reschedulePlanEventsBySowingDate({
  userId,
  plan,
  selectedPlanEvent,
  eventPlanToUpdate,
  newSowingStartDate,
  newSowingEndDate,
  orgSlug,
}: PlanEventInputParams) {
  // Check if all the data are valid
  runValidation({
    userId,
    plan,
    selectedPlanEvent,
    eventPlanToUpdate,
    newSowingStartDate,
    newSowingEndDate,
    orgSlug,
    ccp: eventPlanToUpdate.ccp,
    eventStatus: eventPlanToUpdate.eventStatus,
  });

  try {
    const newPlanEvents = getPlanEventsAfterFormatting({
      newSowingStartDate,
      plan,
      selectedPlanEvent,
      eventPlanToUpdate,
    });

    // Updating all plan events in single query
    await PlanModelApi.update(plan._id.toString(), { events: newPlanEvents }, userId);

    // Rescheduling notification for all plan events
    await scheduleNotificationsForPlan({
      userId,
      plan: {
        _id: plan._id.toString(),
        events: newPlanEvents,
      },
      orgSlug,
    });

    return true;
  } catch (e) {
    console.error(e);
  }

  return false;
}

/** */
function runValidation({
  userId,
  plan,
  selectedPlanEvent,
  newSowingStartDate,
  newSowingEndDate,
  orgSlug,
  ccp,
  eventStatus,
}: PlanEventInputParams) {
  if (!orgSlug) throw new Error('orgSlug not valid.');

  if (!userId) throw new Error('User Id not valid.');

  if (!newSowingStartDate) throw new Error('newSowingStartDate not valid.');
  if (!newSowingEndDate) throw new Error('newSowingEndDate not valid.');

  if (!(plan?._id && plan?.events?.length))
    throw new Error('Plan not valid for rescheduling events.');

  if (!(selectedPlanEvent && selectedPlanEvent?._id))
    throw new Error('Selected event plan not valid for rescheduling events.');

  if (!(typeof ccp === 'boolean')) throw new Error('Ccp field not valid.');

  if (!(eventStatus && PlanEventStatuses.includes(eventStatus)))
    throw new Error('ventStatus not valid.');
}

/** */
function getPlanEventsAfterFormatting({
  selectedPlanEvent,
  plan,
  newSowingStartDate,
  eventPlanToUpdate,
}: Pick<
  PlanEventInputParams,
  'eventPlanToUpdate' | 'selectedPlanEvent' | 'plan' | 'newSowingStartDate'
>) {
  // Get old sowing start date
  const oldSowingStartDate = selectedPlanEvent.range.start;

  const onlySelectPlanEventsAfterOldSowingDate = (pe: PlanEventT): boolean => {
    return dayjs(rearrangeDateDMYToYMD(pe.range.start)).isAfter(
      dayjs(rearrangeDateDMYToYMD(oldSowingStartDate)),
    );
  };

  // removing sowing event, as it's not going to formatted for update
  plan.events = plan.events.filter((i: PlanEventT) => !(i._id === selectedPlanEvent._id));

  // getting list of past plans, to add to bulk update
  const nonUpdatedEvents = plan.events.filter(
    (p: PlanEventT) => !onlySelectPlanEventsAfterOldSowingDate(p),
  );

  // Removing past plans, as they are not needed to be updated
  // and shifting dates for all plan events after sowing date
  const updatedPlanEvents = plan.events
    .filter(onlySelectPlanEventsAfterOldSowingDate)
    .map((planEvent: PlanEventT) =>
      shiftPlanEventDates({
        oldSowingStartDate,
        newSowingStartDate,
        planEvent,
      }),
    );

  return [...nonUpdatedEvents, eventPlanToUpdate, ...updatedPlanEvents];
}

/**
 *
 * @param param0
 * @returns
 */
function shiftPlanEventDates({
  oldSowingStartDate,
  newSowingStartDate,
  planEvent,
}: {
  oldSowingStartDate: string; // should be DD/MM/YYYY
  newSowingStartDate: string; // should be DD/MM/YYYY
  planEvent: PlanEventT;
}) {
  const differenceBetweenSowingDates = getDifferenceBetweenTwoDates(
    oldSowingStartDate,
    newSowingStartDate,
  );

  const newStartDate = getDifferenceCalculatedDate(
    planEvent.range.start,
    differenceBetweenSowingDates,
  );

  const newEndDate = getDifferenceCalculatedDate(planEvent.range.end, differenceBetweenSowingDates);

  // console.log({
  //   oldSowingStartDate,
  //   newSowingStartDate,
  //   range: planEvent.range,
  //   newStartDate,
  //   newEndDate,
  // });

  // Returning with newly calculated dates
  return {
    ...planEvent,
    range: {
      start: newStartDate,
      end: newEndDate,
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

/**
 *
 * @param param0
 * @returns
 */
async function rescheduleNotificationForAllEventPlan({
  userId,
  plan,
  planEvents,
  orgSlug,
}: {
  userId: string;
  plan: PlanT;
  planEvents: PlanEventT[];
  orgSlug: string;
}): Promise<boolean> {
  const promises = [];

  for (const currentPlanEvent of planEvents) {
    promises.push(
      rescheduleAlreadyNotification({
        date: currentPlanEvent.range.start,
        plan,
        eventPlan: currentPlanEvent,
        userId,
        orgSlug,
      }),
    );
  }

  return (await Promise.all(promises)).every((r) => r === true);
}
