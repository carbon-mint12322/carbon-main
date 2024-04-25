import { deleteAllPendingJobsByIds } from '@carbon-mint/jobs';
import { getNotificationJobIdsForCrop } from './getNotificationJobIdsForCrop';
import { initiateMongoConnection } from './initiateMongoConnection';

export async function deleteAllPendingJobsForCrops(cropIds: string[], entityType?: string): Promise<boolean> {
  // initiating db connections
  initiateMongoConnection();

  // get all notificationJobIds to delete
  const notificationJobsIdsToDelete = await getNotificationJobIdsForCrop(cropIds, entityType);

  // delete all the notification job ids
  const { deletedCount } = await deleteAllPendingJobsByIds(notificationJobsIdsToDelete);

  // if deleted count is valid
  return deletedCount > 0;
}
