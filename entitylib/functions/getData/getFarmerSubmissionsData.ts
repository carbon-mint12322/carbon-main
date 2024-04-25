
const getFarmerSubmissionsData = (data: any, modelName: string, reFetch: any, org?: string) => {
    return {
        entity: modelName,
        entityId: data?.id,
        eventData: {
            data: data?.events.filter((event: any) => event.category === 'Submission'),
            eventType: 'Submission',
            onclick: {},
        },
        landParcelMap: data?.landParcelDetails?.map,
        fieldMap: data?.fieldDetails?.map,
        plotMap: data?.plotDetails?.map,
    };
};

export default getFarmerSubmissionsData;
