import { getModel } from '~/backendlib/db/adapter';
import { getUpdateRoles } from '~/backendlib/rbac';
import { PlanEventT } from '~/backendlib/types';
import { scheduleNotificationsForPlan } from './schedule';

const schemaId = '/farmbook/plans';
const permittedRoles = getUpdateRoles(schemaId);
const modelApi = getModel(schemaId);

type InputParams = {
  userId: string;
  orgSlug: string;
  planId: string;
  planEvents: PlanEventT[];
};

/** */
export async function createPlanEvents({
  userId,
  orgSlug,
  planId,
  planEvents,
}: InputParams): Promise<{ planEventIds: string[]; result: any[] }> {
  // getting event ids
  const planEventIds = planEvents.map((planEvent) => planEvent._id);

  // Making promises for appending plane events to array of plan object's events
  const promises = planEvents.map((planEvent) => {
    return modelApi.add(planId, { events: planEvent }, userId);
  });

  // Appending plan events to events array in plan object
  const creationResult = await Promise.all(promises);

  // create notification job for events
  await scheduleNotificationsForPlan({
    plan: {
      _id: planId,
      events: planEvents,
    },
    orgSlug,
    userId,
  });

  return { planEventIds, result: creationResult };
}
