import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);

const createLandParcelEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating land parcel event object');
  const { domainContextObjectId: landParcelId } = wf;
  const eventInput = {
    landParcelId,
    category: 'Land Parcel',
    name: event.eventName,
    details: event.data,
    createdBy: { id: session?.userId, name: session?.name },
    createdAt: dayjs().toISOString(),
  };
  const result = await eventDbApi.create(eventInput, session?.userId);
  wf.domainObjectId = result.insertedId;
  logger.debug('Land parcel event created');
  return result;
};

export default createLandParcelEvent;
