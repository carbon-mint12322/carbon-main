import { Coordinate } from '~/utils/coordinatesFormatter';
import { LandParcelCowInfo } from './landParcel';
import { NameId } from './crop';

export interface Cow {
  _id: string;
  tagId: string;
  age: number;
  cowSource: string;
  acquisitionDay: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSystem: string;
  averageMilkProduction: number;
  lactionaPeriodDays: number;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  field: CowField;
  climateScore: number;
  complianceScore: number;
  status: string;
  landParcel: NameId;
  farmer: NameId;
  cowId: string;
  events: CowEvent[];
  plan: CowPlanElement[];
  fieldDetails: CowDetail[];
  landParcelDetails: CowDetail[];
  id: string;
  entityProgress: CowProgress;
  scheduledEvents: CowScheduledEvents;
  category: any;
  documents: any;
  history: any;
  lactationPeriods: any;
}

export interface CowProgress {
  plan: CowProgressPlan;
  actual: CowActual;
}
export interface CowScheduledEvents {
  plan: CowScheduledEventsPlan;
}

export interface CowActual {
  events: CowActualEvent[];
}

export interface CowActualEvent {
  name: string;
  range: Range;
  details: CowDetails;
}

export interface CowDetails {
  createdAt: string;
  photoRecords: CowPhotoRecord[];
  location: Coordinate;
  name: string;
}

export interface CowPhotoRecord {
  link: string;
  metadata: CowMetadata;
}

export interface CowAudioRecord {
  link: string;
  metadata: CowMetadata;
}

export interface CowDocumentRecord {
  link: string;
  metadata: CowMetadata;
}

export interface CowMetadata {
  location: Coordinate;
  timestamp: Date;
}

export interface CowRange {
  start: string;
  end: string;
}

export interface CowProgressPlan {
  id: string;
  name: string;
  events: CowPlanEvent[];
}

export interface CowScheduledEventsPlan {
  id: string;
  name: string;
  events: CowPlanEvent[];
}

export interface CowPlanEvent {
  _id?: string;
  name: string;
  activityType?: string;
  range: Range;
  details?: CowDetails;
}

export interface CowEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: CowNameId;
  location: Coordinate;
  photoRecords: CowPhotoRecord[];
  audioRecords: CowAudioRecord[];
  documentRecords: CowDocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
}

export interface CowNameId {
  id: string;
  name: string;
}

export interface CowField {
  id: string;
  name: string;
  fbId: string;
}

export interface CowDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

export interface CowPlanElement {
  _id: string;
  name: string;
  events: CowPlanEvent[];
  category: string;
  status: string;
}

export enum CowEventType {
  Submissions = 'Submissions',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

export enum CowTimelineEventType {
  LandPreparation = 'shed_preparation',
  CowIntervention = 'cow_intervention',
  SeedProcessing = 'chick_processing',
}

export interface CowFormData {
  [key: string]: any;
}
