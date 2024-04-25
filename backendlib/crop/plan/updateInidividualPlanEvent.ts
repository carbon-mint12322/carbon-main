import { getModel } from '~/backendlib/db/adapter';
import { PlanEventIndividualUpdateParamsT, PlanEventT } from '~/backendlib/types';
import { scheduleNotificationsForPlan } from './schedule';

const schemaId = '/farmbook/plans';
const PlanModelApi = getModel(schemaId);

/**
 *
 * @param param0
 * @returns
 */
export async function updateInidividualPlanEvent({
  userId,
  plan,
  eventPlanToUpdate,
  orgSlug,
}: PlanEventIndividualUpdateParamsT) {
  // Selecting params to udpate
  const { name, period, activityType, range, ccp, technicalAdvice, eventStatus }: PlanEventT =
    eventPlanToUpdate;

  // Supporting backward compatablity for number based plan event IDs
  const idAsString = eventPlanToUpdate._id.toString();
  const idAsNumber = Number(idAsString);

  const idToUpdate = isNaN(idAsNumber) ? idAsString : idAsNumber;

  // update plan event
  const res = await PlanModelApi.updateNestedDoc(
    plan._id.toString(),
    'events',
    { _id: idToUpdate },
    { name, period, activityType, range, ccp, technicalAdvice, eventStatus },
    userId,
  );

  if (res?.modifiedCount !== 1) return res;

  // Reschedule notificaiton based on new date
  await scheduleNotificationsForPlan({
    plan: {
      _id: plan._id.toString(),
      events: [eventPlanToUpdate],
    },
    userId,
    orgSlug,
  });

  return res;
}
