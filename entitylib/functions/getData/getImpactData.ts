const getImpactData = (data: any, modelName: string, reFetch?: any, org?: string) => {
    return {
        data: data?.events?.filter((event: any) => event.category !== 'Submission')
    };
};

export default getImpactData;
