export default function getDocumentsData(data: any, modelName: string, reFetch: any, org?: string) {
    return {
        data,
        childResourceUri: 'documents',
        modelName,
        reFetch
    };
}

