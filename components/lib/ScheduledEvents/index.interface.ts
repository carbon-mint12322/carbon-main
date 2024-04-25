import { EntityEventType, EntityEventsProps } from "../EntityEvents/index.interface";

export interface ScheduledEventsProps {
    data: any;
    category: string;
    eventData: EntityEventsProps;
    currentPlanId: string | undefined;
    onPlanEventCreateOrUpdateCallback: () => void;
    reFetch?: () => void;
    eventType?: EntityEventType | string;
    EntityEventEditor: any
}
