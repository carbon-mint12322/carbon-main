import { Coordinate } from "~/utils/coordinatesFormatter";
import { PlanEventT } from '~/backendlib/types';


export interface EntityEventsProps {
    entityId?: string;
    entity: string;
    type?: string;
    productionSystemCategory?: string;
    processingSystemCategory?: string;
    collectiveId?: string;
    currentPlanId?: string | undefined;
    data: EntityEventData[];
    eventType?: EntityEventType | string;
    showImages?: boolean;
    showActionButton?: boolean;
    showDivider?: boolean;
    onClick?: (event?: EntityEventData) => void;
    selectedEventId?: string;
    setselectedLocation?: any;
    onPlanEventCreateOrUpdateCallback: () => void;
    allowAddEvent?: boolean;
    EntityEventEditor: any
}


export interface EntityEvent {
    _id: string;
    name: string;
    category: string;
    createdAt: string;
    createdBy: NameId;
    location: Coordinate;
    photoRecords: PhotoRecord[];
    audioRecords: AudioRecord[];
    documentRecords: DocumentRecord[];
    endDate: string;
    startDate: string;
    notes: string;
    id: string;
    details: any;
    markers: any;
    landParcelId?: string;
    processingSystemId?: string;
    cropId?: string;
}


export interface EntityEventData extends EntityEvent {
    range?: {
        start: number | string;
        end: number | string;
    };
}


export interface PhotoRecord {
    link: string;
    metadata: Metadata;
}

export interface AudioRecord {
    link: string;
    metadata: Metadata;
}

export interface DocumentRecord {
    link: string;
    metadata: Metadata;
}

export interface Metadata {
    location: Coordinate;
    timestamp: Date;
}

export interface NameId {
    id: string;
    name: string;
}

export enum EntityEventType {
    Submissions = 'Submission',
    Calendar = 'Calendar',
    Scheduled = 'Scheduled',
}

export enum EntityTimelineEventType {
    LandPreparation = 'land_preparation',
    CropIntervention = 'crop_intervention',
    SeedProcessing = 'seed_processing',
}

export interface EntityPlanEvent {
    _id?: string;
    name: string;
    category?: string;
    activityType?: string;
    range: Range;
    details?: EntityDetails;
    eventStatus?: PlanEventT['eventStatus'];
    ccp: PlanEventT['ccp'];
    planId?: string;
}

export interface Range {
    start: string;
    end: string;
}

export interface EntityDetails {
    createdAt: string;
    photoRecords: PhotoRecord[];
    location: Coordinate;
    name: string;
    fbId: any;
}


export interface EntityScheduledEventsPlan {
    id: string;
    name: string;
    events: EntityPlanEvent[];
}
