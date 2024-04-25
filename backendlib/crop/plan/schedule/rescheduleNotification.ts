import { deleteScheduledNotification } from './deleteScheduledNotification';

import {
  scheduleNotificationForPlanEvent,
  ScheduleObjectParams,
} from './scheduleNotificationForPlanEvent';

export async function rescheduleNotification(
  jobId: string | undefined,
  newJobParams: ScheduleObjectParams,
  userId: string,
): Promise<boolean> {
  // Delete existing job from scheduled
  if (jobId) await deleteScheduledNotification(jobId);

  // Create new job and update the jobId in plan event object
  return scheduleNotificationForPlanEvent({ ...newJobParams, userId });
}
