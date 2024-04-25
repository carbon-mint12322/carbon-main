/**
 *
 *
 */

import { SchedulePlanEventT } from './scheduleNotificationForPlanEvent';

export function generateIdempotentKey({
  planId,
  eventPlanId,
  date,
}: Pick<SchedulePlanEventT, 'eventPlanId' | 'planId' | 'date'>) {
  const idempotentKey = planId + '.' + eventPlanId + '.' + date;

  if (!(typeof idempotentKey === 'string' && idempotentKey.length))
    throw new Error('Not valid idempotent key.');

  return idempotentKey;
}
