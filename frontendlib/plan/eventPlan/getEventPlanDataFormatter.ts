import { EntityPlanEvent } from "../../../components/lib/EntityEvents/index.interface";

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

export function getEventPlanDataFormatter(eventPlan: EntityPlanEvent | undefined) {
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
