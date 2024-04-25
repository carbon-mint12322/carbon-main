import { EntityPlanEvent } from "../EntityEvents/index.interface";


export type CommonEventPlanProps = {
    eventPlanModalHandler?: string;
    currentPlanId?: string | undefined;
    category?: string;
    eventPlan?: EntityPlanEvent | undefined;
    showToggle: boolean;
    setShowToggle: (v: boolean) => void;
    onClose: () => void;
    onCreateOrUpdateCallback: () => void;
    EntityEventEditor: any
};

export type CreateEventPlanProps = CommonEventPlanProps & {
    action: 'post';
};

export type UpdateEventPlanProps = CommonEventPlanProps & {
    eventPlan: EntityPlanEvent;
    action: 'put';
};