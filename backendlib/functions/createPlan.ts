import { PlanEventT } from '../types';
import { scheduleNotificationsForPlan } from '../crop/plan/schedule';
import { getPlanEventsForCropCreation } from '../crop/plan/getPlanEventsForCropCreation';
import { getPlanEventsForSchemeCreation } from '../scheme/plan/getPlanEventsForSchemeCreation';
import { getModel } from '~/backendlib/db/adapter';

const planSchema = '/farmbook/plan';
const PlanApi = getModel(planSchema);

const handleNotificationForEvents = async (
  planId: string,
  events: PlanEventT[],
  userId: string,
  orgSlug: string,
): Promise<boolean> => {
  if (!planId) throw new Error('PlanId not valid');

  if (!(events && events.length)) return false;

  await scheduleNotificationsForPlan({
    plan: {
      _id: planId,
      events,
    },
    userId,
    orgSlug,
  });

  return true;
};

export const createPlan = async (
  popId: string,
  popSchemaId: string,
  entityId: string,
  entitySchemaId: string,
  startDate: string,
  userId: string,
  orgSlug: string,
  schemaId: string,
) => {
  const planInput: any = {
    events: [],
    category: 'Planned',
    status: 'Draft',
  };

  if (popId) {
    const POPApi = getModel(`/farmbook/${popSchemaId}`);
    const pop = await POPApi.get(popId);
    planInput['popId'] = popId;

    if (popSchemaId === 'schemepop') {
      planInput['name'] = pop.schemeName;

      const events = getPlanEventsForSchemeCreation({
        startDate,
        compliancePoints: pop?.compliancePoints ?? [],
      });
      planInput['events'] = events;

    } else {
      planInput['name'] = pop.name;

      const events = getPlanEventsForCropCreation({
        startDate,
        controlPoints: pop?.controlPoints ?? [],
      });
      planInput['events'] = events;
    }

  }

  planInput['relatedTo'] = {
    schemaId,
    entityId,
    entityName: entitySchemaId,
  };

  planInput[`${entitySchemaId}Id`] = entityId;

  const insertedPlan = await PlanApi.create(planInput, userId);
  if (planInput?.events?.length > 0) {
    await handleNotificationForEvents(insertedPlan.insertedId, planInput.events.filter((item: PlanEventT) => item.ccp === true), userId, orgSlug);
  }

  return insertedPlan.insertedId;
};
