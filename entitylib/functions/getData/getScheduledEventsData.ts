import dynamic from 'next/dynamic';

const getActivePlanId = (data: any) => {
  const activePlan = data?.entityProgress?.plan;
  const plan = activePlan;
  if (plan) {
    return plan._id || plan.id;
  }
  return null;
};

const getScheduledEventsData = (data: any, modelName: string, reFetch: any, org?: string) => {
  const planId = getActivePlanId(data);
  return {
    data: data,
    category: modelName,
    eventData: {
      data: data?.entityProgress?.plan?.events?.sort((a: any, b: any) => {
        const startDateA = new Date(a.range.start.split('/').reverse().join('-'));
        const startDateB = new Date(b.range.start.split('/').reverse().join('-'));
        return startDateA.getTime() - startDateB.getTime();
      }),
      eventType: 'Scheduled',
    },
    currentPlanId: planId,
    reFetch,
    EntityEventEditor: dynamic(import(`~/gen/data-views/${modelName}PlanEvent/${modelName}PlanEventEditor.rtml.jsx`))
  };
};

export default getScheduledEventsData;
