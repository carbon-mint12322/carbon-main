import { CreateJobT, IJob, deleteJob, scheduleJob } from '@carbon-mint/jobs';
import { JobParams, ScheduleObjectParams } from './scheduleNotificationForPlanEvent';
import { initiateMongoConnection } from './initiateMongoConnection';
import { getModel } from '~/backendlib/db/adapter';
import { generateScheduleObject } from './generateScheduleObject';
import dayjs from 'dayjs';
import { PlanEventT } from '~/backendlib/types';

const PlanModelApi = getModel('/farmbook/plans');

export type ScheduleNotificationsForPlanInputParams = {
  plan: {
    _id: string;
    events: Array<PlanEventT>;
  };
  orgSlug: string;
  userId: string;
};

/** */
export async function scheduleNotificationsForPlan(
  params: ScheduleNotificationsForPlanInputParams,
): Promise<boolean> {
  try {
    // Connecting db
    await initiateMongoConnection();

    const promises: Array<Promise<boolean>> = [];

    params?.plan?.events?.forEach((event) => {
      promises.push(updateNotificationJobForEvent({ event, params }));
    });

    return (await Promise.all(promises)).every((r) => r);
  } catch (e) {
    //
    console.log('Error at scheduleNotificationsForPlan');
    console.error(e);
  }

  return false;
}

/** */
async function updateNotificationJobForEvent({
  event,
  params,
}: {
  event: PlanEventT;
  params: ScheduleNotificationsForPlanInputParams;
}): Promise<boolean> {
  //
  await deleteAllNotificationJobsIfExists(event);

  // get new notification jobs
  const newNotificationJobs = prepareNotificationJobs({ event, params });

  // create jobs
  const jobIds = await createJobs(newNotificationJobs);

  // update notification job ids in event object
  await udpateNotificationJobIdsInEvent({ event, jobIds, params });

  return true;
}

/** */
async function deleteAllNotificationJobsIfExists(event: PlanEventT): Promise<boolean> {
  // fetch all existing notification job ids
  const jobIds = [
    // if new method refernce ids are available
    ...(event.notificationJobIds?.length ? event.notificationJobIds : []),
    // if old method is available delete them
    ...(event.notificationJobId ? [event.notificationJobId] : []),
  ];

  // delete all records by ids
  if (!jobIds?.length) return true;

  const p: Array<Promise<boolean>> = jobIds.map(deleteIfJobIdValid);

  return (await Promise.all(p)).every((r) => r === true);
}

/** */
async function deleteIfJobIdValid(jobId: string): Promise<boolean> {
  try {
    if (jobId) await deleteJob(jobId.toString());
  } catch (e) {
    console.log(e);
  }

  return false;
}

/** */
function prepareNotificationJobs({
  event,
  params,
}: {
  event: PlanEventT;
  params: ScheduleNotificationsForPlanInputParams;
}): Array<CreateJobT<JobParams>> {
  // the dates on which the notification should be sent
  const dateDifferencesForNotificationJobRunAt = [-3, -2, 0];

  // since it is expected to be DD/MM/YYYY it is reversed to get YYYY-MM-DD
  const eventStartDate = dayjs(event.range?.start.split('/').reverse().join('-'));

  // create three job records for the period of notification
  const jobs: Array<CreateJobT<JobParams>> = [];

  dateDifferencesForNotificationJobRunAt.map((difference) => {
    // calculating the difference and adding notification time based on it

    const runAtDate = eventStartDate.add(difference, 'days');

    // do not schedule notification for run at today or before today
    if (!runAtDate.isAfter(new Date().toISOString())) return;

    jobs.push(
      generateScheduleObject({
        date: runAtDate.toISOString(),
        planId: params.plan._id,
        eventPlanId: event._id.toString(),
        orgSlug: params.orgSlug,
      }),
    );
  });

  return jobs;
}

/** */
async function createJobs(jobs: Array<CreateJobT<JobParams>>): Promise<string[]> {
  const promises: Array<Promise<string>> = [];

  jobs.forEach((job) => promises.push(createJob(job)));

  return Promise.all(promises);
}

/** */
async function createJob(newJobParams: CreateJobT<JobParams>): Promise<string> {
  // Create a schedule for object & jobId
  const createdJob = await scheduleJob(newJobParams);

  if (!createdJob?._id) throw new Error('Job not created.');

  return createdJob._id;
}

/** */
async function udpateNotificationJobIdsInEvent({
  event,
  jobIds,
  params,
}: {
  event: PlanEventT;
  jobIds: string[];
  params: ScheduleNotificationsForPlanInputParams;
}): Promise<boolean> {
  // some ids are number and some are string,
  // if it's a number and we update by string it will return true but nothing will be updated
  const eventId = Number(event._id) ? Number(event._id) : event._id;

  // Update eventPlan with new jobId
  await PlanModelApi.updateNestedDoc(
    params.plan._id,
    'events',
    { _id: eventId },
    { notificationJobIds: jobIds },
    params.userId,
  );

  return true;
}
