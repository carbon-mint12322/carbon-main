import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);
const cropSchemaId = '/farmbook/crop';
const cropDbApi = getModel(cropSchemaId);

const fetchPlanId = async (cropId) => {
  const plan = await planDbApi.getByFilter({ cropId });
  const planId = plan._id.toString();
  return planId;
};

const createCroppingSystemEvent = async (ctx) => {
  const { logger, wf, event, session } = ctx;
  logger.debug('creating event object');
  const { domainContextObjectId: csId } = wf;
  const crops = await cropDbApi.list({ croppingSystem: csId }, { _id: 1 });
  crops.forEach(async (crop) => {
    const eventInput = {
      cropId: crop._id.toString(),
      planId: await fetchPlanId(crop._id.toString()),
      category: 'Crop',
      name: event.eventName,
      details: event.data,
      createdBy: { id: session?.userId, name: session?.name },
      createdAt: dayjs().toISOString(),
    };
    const result = await eventDbApi.create(eventInput, session?.userId);
    wf.domainObjectId = result.insertedId;
    logger.debug('Cropping system event created');
  });
  return true;
};

export default createCroppingSystemEvent;
