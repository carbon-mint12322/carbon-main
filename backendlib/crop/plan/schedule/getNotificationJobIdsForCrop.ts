import { PlanEventT } from '~/backendlib/types';
import { PlanT } from '~/backendlib/types';
import { getModel } from '~/backendlib/db/adapter';

const PlanModelApi = getModel('/farmbook/plan');

/** get all notification jobs ids */
export async function getNotificationJobIdsForCrop(
  cropIds: string[],
  entityType?: string,
): Promise<string[]> {

  let filter = {};

  switch (entityType) {
    case 'crop':
      filter = { cropId: { $in: cropIds } };
      break;
    case 'poultry':
      filter = { poultryId: { $in: cropIds } };
      break;
    case 'aqua':
      filter = { aquaId: { $in: cropIds } };
      break;
    default:
      filter = { cropId: { $in: cropIds } };
      break;
  }

  // get all plans for crops
  const plans: PlanT[] = await PlanModelApi.list(filter);

  // get all plan events from plans
  const planEvents: PlanEventT[] = plans.map((p: PlanT) => p?.events ?? []).flat();

  // get all notifications in plan events
  const notificationJobIds: string[] = planEvents
    .map((e: PlanEventT) => e?.notificationJobIds ?? null)
    .flat()
    .filter((id: string | null): id is string => !!id);

  const deprecatedNotificationJobIds: string[] = planEvents
    .map((e: PlanEventT) => e?.notificationJobId ?? null)
    .filter((id: string | null): id is string => !!id);

  return [...notificationJobIds, ...deprecatedNotificationJobIds].map((s) => s.toString());
}
