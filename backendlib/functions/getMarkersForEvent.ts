import { getModel } from '../db/adapter';

const EVENT_SCHEMA_ID = `/farmbook/event`;
const EventApi = getModel(EVENT_SCHEMA_ID);
const FILE_SCHEMA_ID = `${process.env.TENANT_NAME}.files`;
const FileApi = getModel(FILE_SCHEMA_ID);

export const getMarkersForEvent = async (eventId: string) => {
    const event = await EventApi.get(eventId);
    const records: string[] = [];
    if (event.details.evidences)
        records.push(...event.details.evidences);
    if (event.details.durationAndExpenses 
        && event.details.durationAndExpenses.photoEvidenceBeforeAfter 
        && event.details.durationAndExpenses.photoEvidenceBeforeAfter.length > 0) 
        records.push(...event.details.durationAndExpenses.photoEvidenceBeforeAfter);
    if (event.details.durationAndExpenses
        && event.details.durationAndExpenses.documentEvidenceInvoice
        && event.details.durationAndExpenses.documentEvidenceInvoice.length > 0)
        records.push(...event.details.durationAndExpenses.documentEvidenceInvoice);
    const markers: any[] = [];
    const promises = records?.map(async (record: any) => {
        const filename = record.substring(record.lastIndexOf('/') + 1);
        const file = await FileApi.findOneAtRoot({ filename });
        if (file && file.metadata?.location) {
            markers.push({
                position: {
                    lat: file.metadata?.location?.lat,
                    lng: file.metadata?.location?.lng,
                },
            });
        }
    });
    await Promise.all(promises);
    return markers;
};
