import makeLogger from '../logger';
import { getModel } from '../db/adapter';

const logger = makeLogger('/api/.../event/update');

const schemaId = `/farmbook/event`;
const modelApi = getModel(schemaId);

export const updateEventsBulk = async (bulkData: any, userId: string) => {
  logger.debug('Updating events in DB');
  const events = await modelApi.list({});
  return events.map((event: any) => {
    return modelApi.update(event._id.toString(), {createdBy : event.createdBy?.id}, userId);
  })
};
