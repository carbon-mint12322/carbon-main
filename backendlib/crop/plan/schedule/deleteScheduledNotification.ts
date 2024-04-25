import { deleteJob } from '@carbon-mint/jobs';
import { initiateMongoConnection } from './initiateMongoConnection';

export async function deleteScheduledNotification(jobId: string): Promise<boolean> {
  await initiateMongoConnection();

  return deleteJob(jobId);
}
