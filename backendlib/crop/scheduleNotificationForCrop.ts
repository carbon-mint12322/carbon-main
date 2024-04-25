import { scheduleNotificationsForPlan } from '~/backendlib/crop/plan/schedule';
import { getModel } from '../db/adapter';

const planSchema = '/farmbook/plan';
const PlanApi = getModel(planSchema);

/** */
export async function scheduleNotificationForCrop({
  cropId,
  userId,
  orgSlug,
  entityType,
}: {
  cropId: string;
  userId: string;
  orgSlug: string;
  entityType?: string;
}): Promise<boolean> {
  if (!(cropId && typeof cropId === 'string')) throw new Error('cropId slug not valid');

  if (!(orgSlug && typeof orgSlug === 'string')) throw new Error('Org slug not valid');

  let filter = {};

  switch (entityType) {
    case 'crop':
      filter = { cropId };
      break;
    case 'poultry':
      filter = { $or: [{ poultryId: cropId }, { poultrybatchId: cropId }  ] };
      break;
    case 'aqua':
      filter = { aquaId: cropId };
      break;
    default:
      filter = { cropId };
      break;
  }

  // get plans for crop
  const plan = await PlanApi.getByFilter(filter);
  if (!(plan?._id && plan.events)) throw new Error('Plan not valid.');

  //
  return scheduleNotificationsForPlan({
    plan,
    orgSlug,
    userId,
  });
}
