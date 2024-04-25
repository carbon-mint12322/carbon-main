import { Coordinate } from '~/utils/coordinatesFormatter';

export interface Sheep {
  _id: string;

  goatSource: string;

  startDate: string;
  farmer_id: string;
  farmer_name: string;

  sheepSoure: string;
  breed: number;
  gender: string;
  age: string;
  dob: string;
  tagId: string;
  pedigree: string;
  sheepSource: string;
  productionSystem: string;
  landParcel: SheepNameId;
  farmer: SheepNameId;
  estHarvestDate: string;
  chickPlacementDay: string;

  field: SheepField;
  climateScore: number;
  complianceScore: number;
  status: string;
  sheepId: string;
  events: SheepEvent[];
  plan: SheepPlanElement[];
  fieldDetails: SheepDetail[];
  landParcelDetails: SheepDetail[];
  id: string;
  sheepProgress: SheepProgress;
  scheduledEvents: SheepScheduledEvents;
  category: any;
  documents: any;
  history: any;
}

export interface SheepProgress {
  plan: SheepProgressPlan;
  actual: SheepActual;
}
export interface SheepScheduledEvents {
  plan: SheepScheduledEventsPlan;
}

export interface SheepActual {
  events: SheepActualEvent[];
}

export interface SheepActualEvent {
  name: string;
  range: Range;
  details: SheepDetails;
}

export interface SheepDetails {
  createdAt: string;
  photoRecords: SheepPhotoRecord[];
  location: Coordinate;
  name: string;
}

export interface SheepPhotoRecord {
  link: string;
  metadata: SheepMetadata;
}

export interface SheepAudioRecord {
  link: string;
  metadata: SheepMetadata;
}

export interface SheepDocumentRecord {
  link: string;
  metadata: SheepMetadata;
}

export interface SheepMetadata {
  location: Coordinate;
  timestamp: Date;
}

export interface SheepRange {
  start: string;
  end: string;
}

export interface SheepProgressPlan {
  id: string;
  name: string;
  events: SheepPlanEvent[];
}

export interface SheepScheduledEventsPlan {
  id: string;
  name: string;
  events: SheepPlanEvent[];
}

export interface SheepPlanEvent {
  _id?: string;
  name: string;
  activityType?: string;
  range: Range;
  details?: SheepDetails;
}

export interface SheepEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: SheepNameId;
  location: Coordinate;
  photoRecords: SheepPhotoRecord[];
  audioRecords: SheepAudioRecord[];
  documentRecords: SheepDocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
}

export interface SheepNameId {
  id: string;
  name: string;
}

export interface SheepField {
  id: string;
  name: string;
  fbId: string;
}

export interface SheepDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

export interface SheepPlanElement {
  _id: string;
  name: string;
  events: SheepPlanEvent[];
  category: string;
  status: string;
}

export enum SheepEventType {
  Submissions = 'Submissions',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

export enum SheepTimelineEventType {
  LandPreparation = 'shed_preparation',
  SheepIntervention = 'sheep_intervention',
  SeedProcessing = 'chick_processing',
}

export interface SheepFormData {
  [key: string]: any;
}
