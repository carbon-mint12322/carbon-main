import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const psSchemaId = '/farmbook/processingsystem';
const psDbApi = getModel(psSchemaId)

const createProcessingSystemEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating processing system event object');
  const { domainContextObjectId: processingSystemId } = wf;
  const processingSystem = await psDbApi.get(processingSystemId)
  const eventInput = {
    processingSystemId,
    landParcelId : processingSystem.landParcel,
    category: 'Processing System',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Processing system event created');
  return result;
};

export default createProcessingSystemEvent;
