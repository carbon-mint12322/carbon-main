import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);

const createSheepProductionSystemEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: productionSystemId } = wf;
  console.log('This is where the ctx and context lies', ctx);
  const eventInput = {
    productionSystemId,
    category: 'Sheep Production System',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Sheep Production System event created');
  return result;
};

export default createSheepProductionSystemEvent;
