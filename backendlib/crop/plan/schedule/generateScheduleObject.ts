/**
 *
 *
 */

import { CreateJobT, isIsoDate } from '@carbon-mint/jobs';
import { JobParams, ScheduleObjectParams } from './scheduleNotificationForPlanEvent';
import { generateIdempotentKey } from './generateIdempotentKey';
import { getUriForPlanEventNotification } from './getUriForPlanEventNotification';

export function generateScheduleObject({
  date,
  planId,
  eventPlanId,
  orgSlug,
}: ScheduleObjectParams): CreateJobT<JobParams> {
  if (!isIsoDate(date)) throw new Error('Date not valid ISO string.');

  if (!planId) throw new Error('Plan Id not valid.');

  if (!eventPlanId) throw new Error('EventPlanId not valid.');

  const idempotentKey = generateIdempotentKey({ planId, eventPlanId, date });

  const uri = getUriForPlanEventNotification(orgSlug);

  return {
    type: 'API_CALL',
    idempotentKey,
    params: {
      platform: 'farmbook',
      data: {
        uri,
        planId,
        eventPlanId,
        orgSlug,
      },
    },
    runAt: date,
  };
}
