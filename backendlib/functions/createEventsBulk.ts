import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import * as T from '../workflow/types';
import { startWf3 } from '../workflow/engine';
import getWorkflowDef from '../../gen/workflows';
import { uploadFormFile } from '../upload/file';
import moment from 'moment';

const logger = makeLogger('/api/.../event/bulk-create');

const userSchemaId = `/farmbook/user`;
const eventSchemaId = `/farmbook/event`;
const userModel = getModel(userSchemaId);
const eventModel = getModel(eventSchemaId);

type EventCreateWfInput = {
    wfName: string;
    modelName: string;
    id: string;
    parsedEventData: any;
    domainObjectId: string;
    eventName: string;
};

async function startCreateEventWf(input: EventCreateWfInput, session: T.UserSession) {
    const { wfName, modelName, id, parsedEventData, domainObjectId, eventName } = input;
    const _def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(wfName);
    if (!_def) {
        throw new Error('Unknown workflow definition');
    }
    const wfDef = { ..._def, domainSchemaId: '/farmbook/event' };
    logger.info(`starting workflow ${wfDef.name} for ${wfDef.domainSchemaId}, id: ${domainObjectId}`);
    const result = await startWf3(
        wfDef,
        `/farmbook/event`,
        undefined,
        `/farmbook/${modelName}`,
        id,
        eventName,
        parsedEventData,
        session,
    );
    return result;
}

export const createEventsBulk = async (bulkData: any, userId: string) => {
    const { collective, requestData: data } = bulkData
    const { entityIds, event, domainSchemaName } = data
    const user = await userModel.get(userId)
    const roles: string[] = user.roles[event.org];
    const {
        wfName,
        eventName,
        eventData,
        org
    }: T.WorkflowStartHandlerInput = event;

    const startDate = eventData?.durationAndExpenses ? eventData.durationAndExpenses?.startDate : eventData.startDate || eventData.dateOfPurchase;
    const endDate = eventData?.durationAndExpenses ? eventData.durationAndExpenses?.endDate : eventData.endDate || eventData.dateOfPurchase;
    const endDateBuffer = moment(endDate).add(1, 'days').format('YYYY-MM-DD');

    const session: any = {
        userId,
        email: user.email,
        name:
            user.personalDetails?.firstName +
            ' ' +
            (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
        roles,
    }



    return entityIds.map(async (id: any) => {
        //attach evidences to each crop's events if any in the last filtered days  
        const eventArray = await eventModel.aggregate([
            { $match: { cropId: id, category: "Submission", createdAt: { $gte: startDate, $lte: endDateBuffer } } },
            {
                $project: {
                    photoRecords: { link: 1, photo: 1 },
                }
            }
        ])
        const evidences = eventArray.flatMap((event: any) => event.photoRecords.map((record: any) => record.link))
        const finalEventData = evidences.length > 0 ? { ...eventData, evidences } : eventData
        const parsedEventData = await uploadFormFile(finalEventData);
        if (!org && !(wfName && eventName && parsedEventData)) { return }
        const eventCreateWfInput: EventCreateWfInput = {
            wfName,
            modelName: domainSchemaName,
            id,
            parsedEventData,
            domainObjectId: id,
            eventName,
        };
        const res = await startCreateEventWf(eventCreateWfInput, session);
        return res;
    })
};