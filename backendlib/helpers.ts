import dayjs from 'dayjs';
import { getModel } from './db/adapter';
import { PlanEventT, PlanT } from './types';
import { ACTIVITY_TYPE } from './constants';

const planSchemaId = '/farmbook/plan';
const PlanModelApi = getModel(planSchemaId);

export async function fetchPlanIdByCtx(ctx: any) {
  const plan = await fetchPlanByCtx(ctx);
  const planId = plan._id.toString();
  return planId;
}

export const fetchPlanByCtx = async (ctx: any) => {
  const { logger, wf, data } = ctx;
  logger.debug('fetching plan ID');
  const { domainContextObjectId } = wf;
  return PlanModelApi.getByFilter({ cropId: domainContextObjectId });
};

/**
 *
 * @param planId
 * @returns
 */
export async function findPlanById(planId: string): Promise<PlanT> {
  // Get plan from db
  const plan = await PlanModelApi.get(planId);

  if (!plan._id) throw new Error('Plan not found.');

  return plan;
}

/**
 *
 * @param param0
 * @returns
 */
export async function findPlanEventById({
  plan,
  eventPlanId,
}: {
  plan: PlanT;
  eventPlanId: string;
}): Promise<PlanEventT> {
  const eventPlan = plan?.events?.find((event: any) => {
    // Comparing with common data type
    return event._id.toString() === eventPlanId.toString();
  });

  if (!eventPlan?._id) throw new Error('Event plan not found.');

  return eventPlan;
}

/**
 *
 */
export function findSowingEventInPlanEvents(planEvents: PlanEventT[]): any {
  const planEvent = planEvents?.find(
    (event: PlanEventT) => event.activityType === ACTIVITY_TYPE.PLANTATION,
  );

  return planEvent;
}

/**
 * @param param0
 * @returns
 */
export function getFormattedRange({ range }: Pick<PlanEventT, 'range'>) {
  return {
    start: dayjs(range.start).format('DD/MM/YYYY'),
    end: dayjs(range.end).format('DD/MM/YYYY'),
  };
}

/**
 *
 */
export function findChickPlacementEventInPlanEvents(planEvents: PlanEventT[]): any {
  const planEvent = planEvents?.find(
    (event: PlanEventT) => event.name === ACTIVITY_TYPE.CHICK_PLACEMENT,
  );

  return planEvent;
}

/**
 *
 */
export function findStockingEventInPlanEvents(planEvents: PlanEventT[]): any {
  const planEvent = planEvents?.find(
    (event: PlanEventT) => event.name === ACTIVITY_TYPE.STOCKING,
  );

  return planEvent;
}
