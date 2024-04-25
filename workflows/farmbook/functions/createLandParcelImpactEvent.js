import { getModel } from '../../../backendlib/db/adapter';
import dayjs from 'dayjs';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);

const createLandParcelImpactEvent = async (ctx) => {
    const { logger, wf, event, session } = ctx;
    logger.debug('creating land parcel impact event object');
    const { domainContextObjectId: landParcelId } = wf;
    const impactData = {
        energySaved: ((event.data.quantity - event.data.weightAfterDrying) * 0.57).toFixed(2),
        waterSaved: ((event.data.quantity * 0.93) - (event.data.weightAfterDrying * 0.2)).toFixed(2),
        ghgEmissionsSaved: ((event.data.quantity * 467) * 0.000001).toFixed(2),
        methaneReductions: (event.data.quantity * 0.125).toFixed(2)
    }
    const eventInput = {
        landParcelId,
        category: 'Land Parcel',
        name: event.eventName,
        details: {...event.data, ...impactData},
        createdBy: { id: session?.userId, name: session?.name },
        createdAt: dayjs().toISOString(),
    };
    const result = await eventDbApi.create(eventInput, session?.userId);
    wf.domainObjectId = result.insertedId;
    logger.debug('Land parcel impact event created');
    return result;
};

export default createLandParcelImpactEvent;
