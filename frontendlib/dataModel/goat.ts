import { Coordinate } from '~/utils/coordinatesFormatter';

export interface Goat {
  _id: string;

  age: number;
  goatSource: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  landParcel: GoatNameId;
  farmer: GoatNameId;
  estHarvestDate: string;
  field: GoatField;
  climateScore: number;
  complianceScore: number;
  status: string;
  goatId: string;
  events: GoatEvent[];
  plan: GoatPlanElement[];
  fieldDetails: GoatDetail[];
  landParcelDetails: GoatDetail[];
  id: string;
  tagId: string;
  entityProgress: GoatProgress;
  scheduledEvents: GoatScheduledEvents;
  category: any;
  documents: any;
  history: any;
}

export interface GoatProgress {
  plan: GoatProgressPlan;
  actual: GoatActual;
}
export interface GoatScheduledEvents {
  plan: GoatScheduledEventsPlan;
}

export interface GoatActual {
  events: GoatActualEvent[];
}

export interface GoatActualEvent {
  name: string;
  range: Range;
  details: GoatDetails;
}

export interface GoatDetails {
  createdAt: string;
  photoRecords: GoatPhotoRecord[];
  location: Coordinate;
  name: string;
}

export interface GoatPhotoRecord {
  link: string;
  metadata: GoatMetadata;
}

export interface GoatAudioRecord {
  link: string;
  metadata: GoatMetadata;
}

export interface GoatDocumentRecord {
  link: string;
  metadata: GoatMetadata;
}

export interface GoatMetadata {
  location: Coordinate;
  timestamp: Date;
}

export interface GoatRange {
  start: string;
  end: string;
}

export interface GoatProgressPlan {
  id: string;
  name: string;
  events: GoatPlanEvent[];
}

export interface GoatScheduledEventsPlan {
  id: string;
  name: string;
  events: GoatPlanEvent[];
}

export interface GoatPlanEvent {
  _id?: string;
  name: string;
  activityType?: string;
  range: Range;
  details?: GoatDetails;
}

export interface GoatEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: GoatNameId;
  location: Coordinate;
  photoRecords: GoatPhotoRecord[];
  audioRecords: GoatAudioRecord[];
  documentRecords: GoatDocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
}

export interface GoatNameId {
  id: string;
  name: string;
}

export interface GoatField {
  id: string;
  name: string;
  fbId: string;
}

export interface GoatDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

export interface GoatPlanElement {
  _id: string;
  name: string;
  events: GoatPlanEvent[];
  category: string;
  status: string;
}

export enum GoatEventType {
  Submissions = 'Submissions',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

export enum GoatTimelineEventType {
  LandPreparation = 'shed_preparation',
  GoatIntervention = 'goat_intervention',
  SeedProcessing = 'chick_processing',
}

export interface GoatFormData {
  [key: string]: any;
}
