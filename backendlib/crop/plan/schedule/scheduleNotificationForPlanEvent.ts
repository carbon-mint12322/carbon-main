import { isIsoDate, scheduleJob, CreateJobT, connectDb } from '@carbon-mint/jobs';

import { getModel } from '~/backendlib/db/adapter';
import { initiateMongoConnection } from './initiateMongoConnection';
import { generateScheduleObject } from './generateScheduleObject';

const schemaId = '/farmbook/plans';
const modelApi = getModel(schemaId);

export type SchedulePlanEventT = {
  date: string; // ISO date string from date object
  uri: string; // URI to call when the scheduled time comes
  planId: string; // Object id of plan
  eventPlanId: string; // Id of event plan (which is inside events array)
  idempotentKey: string; // A key which is generated with planId & eventPlanId
  orgSlug: string; // Getting operator's orgSlug to process the request further
};

export type ScheduleObjectParams = Pick<
  SchedulePlanEventT,
  'date' | 'planId' | 'eventPlanId' | 'orgSlug'
>;
export type JobParams = Pick<SchedulePlanEventT, 'eventPlanId' | 'uri' | 'orgSlug' | 'planId'>;

export async function scheduleNotificationForPlanEvent({
  date,
  planId,
  eventPlanId,
  userId,
  orgSlug,
}: ScheduleObjectParams & { userId: string }): Promise<boolean> {
  try {
    // Connecting db

    await initiateMongoConnection();

    // Generate schedule object
    const newJobParams = generateScheduleObject({
      date,
      planId,
      eventPlanId,
      orgSlug,
    });

    // Create a schedule for object & jobId
    const createdJob = await scheduleJob(newJobParams);

    if (!createdJob?._id) throw new Error('Job not created.');

    const eventPlanIdCleaned = Number(eventPlanId) ? Number(eventPlanId) : eventPlanId;

    // Update eventPlan with new jobId
    await modelApi.updateNestedDoc(
      planId,
      'events',
      { _id: eventPlanIdCleaned },
      {
        notificationJobId: createdJob._id,
      },
      userId,
    );

    return true;
  } catch (e) {
    throw new Error('Schedule object create failed. Reason: ' + (e as Error).message);
  }
}
