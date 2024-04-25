import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);

const createPoultryProductionSystemEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: productionSystemId } = wf;
  const eventInput = {
    productionSystemId,
    category: 'Poultry Production System',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Poultry production system event created');
  return result;
};

export default createPoultryProductionSystemEvent;
