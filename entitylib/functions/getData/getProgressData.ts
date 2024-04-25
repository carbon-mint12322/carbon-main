import dynamic from 'next/dynamic';


const getProgressData = (data: any, modelName: string, reFetch: any, org?:string) => {
  return {
    data: {
      ...data,
      landParcelMap: data?.landParcelDetails?.map,
      fieldMap: data?.fieldDetails?.map,
    },
    category: modelName,
    entity: modelName,
    eventData: {
      data: data?.events?.filter((event: any) => event.category !== 'Submission'),
      eventType: 'Calendar',
    },
    reFetch,
    EntityEventEditor: dynamic(import(`~/gen/data-views/${modelName}PlanEvent/${modelName}PlanEventEditor.rtml.jsx`))

  };
};

export default getProgressData;
