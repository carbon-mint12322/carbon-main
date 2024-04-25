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
  const plan = await planDbApi.getByFilter({ aquaId: domainContextObjectId });
  const planId = plan._id.toString();
  return planId;
};

const createAquaCropEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: aquaId } = wf;
  const eventInput = {
    aquaId,
    planId: await fetchPlanId(ctx),
    category: 'Aquaculture Crop',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Aquaculture crop event created');
  return result;
};

export default createAquaCropEvent;
