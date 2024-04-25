export default function getSchemePOPEventsData(data: any, modelName: string, reFetch: any, org?: string) {
    return {
        data,
        childResourceUri: 'compliancepoint',
        modelName,
        reFetch
    };
}

