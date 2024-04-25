import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);

const fetchPlanId = async (ctx) => {
  const { logger, wf, data } = ctx;
  logger.debug('fetching plan ID');
  const cropId = wf.domainContextObjectId || wf.domainObjectId;
  const plan = await planDbApi.getByFilter({ cropId });
  const planId = plan ? plan._id.toString() : null;
  return planId;
};

const createCropEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: cropId } = wf;
  const eventInput = {
    cropId,
    planId: await fetchPlanId(ctx),
    category: 'Crop',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Crop event created', { result });
  return result;
};

export default createCropEvent;
