import { CropPlanEvent } from '~/frontendlib/dataModel/crop';

type CreateInputParams = {
  planId: string
  eventPlanId?: string | undefined
  action: 'post'
  data: CropPlanEvent
}

type UpdateInputParams = {
  planId: string
  eventPlanId: string
  action: 'put'
  data: CropPlanEvent
};

type InputParams = CreateInputParams | UpdateInputParams;

type OutputParams = {
  data: CropPlanEvent;
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
