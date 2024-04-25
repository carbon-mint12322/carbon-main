import { CropPlanEvent, PoultryPlanEvent, AquaCropPlanEvent } from '~/frontendlib/dataModel';

const rearrangeDate = (date: string | undefined) => {
  if (!date) {
    return '';
  }

  if (date.includes('/')) {
    const [dd, mm, yyyy] = date.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  return date;
};

export function getEventPlanDataFormatter(eventPlan: CropPlanEvent | PoultryPlanEvent | AquaCropPlanEvent | undefined) {
  return {
    data: {
      ...eventPlan,
      range: {
        start: rearrangeDate(eventPlan?.range?.start),
        end: rearrangeDate(eventPlan?.range?.end),
      },
    },
  };
}
