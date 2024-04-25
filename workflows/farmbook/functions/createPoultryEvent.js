import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);

const fetchPlanId = async (ctx) => {
  const { logger, wf, data } = ctx;
  logger.debug('fetching plan ID');
  const { domainContextObjectId } = wf;
  let plan = await planDbApi.getByFilter({ poultryId: domainContextObjectId });
  if (!plan) plan = await planDbApi.getByFilter({ poultrybatchId: domainContextObjectId });
  const planId = plan._id.toString();
  return planId;
};

const createPoultryEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: poultryId } = wf;
  const eventInput = {
    poultryId,
    planId: await fetchPlanId(ctx),
    category: 'Poultry',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Poultry event created');
  return result;
};

export default createPoultryEvent;
