import dayjs, { Dayjs } from 'dayjs';
import { PlanEventT, PlanT } from '~/backendlib/types';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { rescheduleNotification } from './schedule';
import { getNumberOfDaysBeforePlanEventForNotification } from '~/backendlib/util/getNumberOfDaysBeforePlanEventForNotification';
import { isJobCompleted } from './schedule/isJobCompleted';

export default async function rescheduleAlreadyNotification({
  date,
  plan,
  eventPlan,
  userId,
  orgSlug,
}: {
  date: string;
  plan: PlanT;
  eventPlan: PlanEventT;
  userId: string;
  orgSlug: string;
}) {
  const eventDate = getEventDateForNotification(date);

  // if job id is undefiend then it can be rescheduled else needs to check if it's not completed
  if (eventPlan.notificationJobId && (await isJobCompleted(eventPlan.notificationJobId)))
    return false;

  await rescheduleNotification(
    eventPlan.notificationJobId,
    {
      date: eventDate,
      planId: plan._id.toString(),
      eventPlanId: eventPlan._id.toString(),
      orgSlug,
    },
    userId,
  );

  return true;
}

/** */
function getEventDateForNotification(date: string) {
  const newDate = dayjs(rearrangeDateDMYToYMD(date)).add(
    getNumberOfDaysBeforePlanEventForNotification(),
    'days',
  );

  return zerofyTimeInISOstring(newDate);
}

/** */
function zerofyTimeInISOstring(date: Dayjs): string {
  // remove time from ISO string and zerofy all time, change zone to UTC
  return date.toISOString().split('T')[0] + 'T00:00:00.000Z';
}
