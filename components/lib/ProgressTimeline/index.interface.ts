import {
    CropActualEvent as EntityActualEvent,
    CropPlanEvent as EntityPlanEvent,
    CropDetails,
    Range,
    CropTimelineEventType,
} from '~/frontendlib/dataModel';
import {
    TimelineItemBase,
    TimelineGroupBase,
} from 'react-calendar-timeline';

export type EntityEvent = EntityActualEvent | EntityPlanEvent;

export interface DetailsParams extends CropDetails {
    createdBy?: any;
    evidences?: any;
}

export interface EntityEventTimelineData extends TimelineItemBase<number> {
    id: number | string;
    bgColor?: string;
    selectedBgColor?: string;
    color?: string;
    name: string;
    range: Range;
    details?: DetailsParams;
    type?: CropTimelineEventType;
    currentPlanId: string;
}

export interface EntityEventTimelineGroup extends TimelineGroupBase {
    id: string;
    title: string;
    desc: string;
    color: string;
}

export interface IEventPlanEditModal {
    category?: string;
    eventPlanModalHandler?: string;
    currentPlanId?: string;
    eventPlanId?: string;
    onPlanEventCreateOrUpdateCallback?: () => void;
    time?: number;
    EntityEventEditor?: any
}
export interface ProgressTimelineProps {
    data: any;
    category: string;
    onItemSelection?: (eventItem?: EntityEventTimelineData) => void;
    selectedEvent?: EntityEventTimelineData;
    isEntityCalendar?: boolean;
    reFetch?: () => void;
    EntityEventEditor: any
}

export type ColorHexCode = `#${string}`;
