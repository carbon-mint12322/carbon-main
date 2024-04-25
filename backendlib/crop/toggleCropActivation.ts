import { deleteAllPendingJobsForCrops } from '~/backendlib/crop/plan/schedule/deleteAllPendingJobsForCrops';
import { scheduleNotificationForCrop } from './scheduleNotificationForCrop';

/** */
export async function toggleCropActivation({
  activationStatus,
  cropIds,
  userId,
  orgSlug,
  entityType,
}: {
  activationStatus: boolean;
  cropIds: string[];
  userId: string;
  orgSlug: string;
  entityType?: string;
}): Promise<boolean> {
  // check if plan id valid
  if (!(cropIds && cropIds.every((i) => typeof i === 'string')))
    throw new Error('cropIds not valid.');

  // check if activation is valid
  if (!(typeof activationStatus === 'boolean')) throw new Error('Activation Status not valid.');

  // if need to activate
  if (activationStatus) {
    return (
      await Promise.all(
        cropIds.map((cropId) =>
          scheduleNotificationForCrop({ cropId, userId, orgSlug, entityType }),
        ),
      )
    ).every((r) => r);
  } else {
    // if need to deactivate crop then delete all notification scheduled for future
    return deleteAllPendingJobsForCrops(cropIds, entityType);
  }
}
