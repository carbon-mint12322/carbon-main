import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);

const createCollectiveEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating collective event object');
  const { domainContextObjectId: collectiveId } = wf;
  const eventInput = {
    collectiveId,
    category: 'Operator',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  logger.debug('Collective event created');
  return result;
};

export default createCollectiveEvent;
