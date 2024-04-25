import { EntityPlanEvent } from "../../../components/lib/EntityEvents/index.interface"

type CreateInputParams = {
  planId: string
  eventPlanId?: string | undefined
  action: 'post'
  data: EntityPlanEvent
}

type UpdateInputParams = {
  planId: string
  eventPlanId: string
  action: 'put'
  data: EntityPlanEvent
};

type InputParams = CreateInputParams | UpdateInputParams;

type OutputParams = {
  data: EntityPlanEvent;
  uri: string;
  action: 'post' | 'put';
};

export function getEventPlanCRUD(params: InputParams): OutputParams {

  const {
    planId,
    data,
    action,
    eventPlanId
  } = params;

  switch (action) {
    case 'post':
      return {
        data,
        uri: `/plan/${planId}/add`,
        action,
      };
    case 'put':
      return {
        data,
        uri: `/plan/${planId}/update/${eventPlanId}`,
        action,
      };
    default:
      throw new Error('Action not supported');
  }
}
