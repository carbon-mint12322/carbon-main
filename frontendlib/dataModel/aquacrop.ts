import { Coordinate } from '~/utils/coordinatesFormatter';
import { LandParcelAquaCropDetails } from './landParcel';
import { NameId } from './crop';

export interface AquaCrop {
  _id: string;
  cropType: string;
  cropSubType: string;
  quantity: number;
  plannedStockingDate: string;
  estHarvestDate: string;
  estimatedYieldTonnes: number;
  seedVariety: string;
  seedSource: string;
  seedEvidence: string;
  seedCertificate: string;
  actualYieldTonnes: number;
  actualStockingDate: string;
  actualHarvestDate: string;
  costOfCultivation: number;
  productionSystem: string;
  aquaPop: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  field: AquaCropField;
  climateScore: number;
  complianceScore: number;
  status: string;
  aquacropId: string;
  events: AquaCropEvent[];
  plan: AquaCropPlanElement[];
  fieldDetails: AquaCropDetail[];
  landParcel: NameId;
  farmer: NameId;
  landParcelDetails: AquaCropDetail[];
  id: string;
  fbId: string;
  risk: string;
  entityProgress: AquaCropProgress;
  scheduledEvents: AquaCropScheduledEvents;
  category: any;
  documents: any;
  history: any;
  qrLink?: string;
}

export interface AquaCropProgress {
  plan: AquaCropProgressPlan;
  actual: AquaCropActual;
}

export interface AquaCropActual {
  events: AquaCropActualEvent[];
}

export interface AquaCropActualEvent {
  name: string;
  range: AquaCropRange;
  details: AquaCropDetails;
}

export interface AquaCropDetails {
  createdAt: string;
  photoRecords: AquaCropPhotoRecord[];
  location: Coordinate;
  name: string;
}

export interface AquaCropPhotoRecord {
  link: string;
  metadata: AquaCropMetadata;
}

export interface AquaCropScheduledEvents {
  plan: AquaCropScheduledEventsPlan;
}

export interface AquaCropAudioRecord {
  link: string;
  metadata: AquaCropMetadata;
}

export interface AquaCropDocumentRecord {
  link: string;
  metadata: AquaCropMetadata;
}

export interface AquaCropMetadata {
  location: Coordinate;
  timestamp: Date;
}

export interface AquaCropRange {
  start: string;
  end: string;
}

export interface AquaCropProgressPlan {
  id: string;
  name: string;
  events: AquaCropPlanEvent[];
}

export interface AquaCropScheduledEventsPlan {
  id: string;
  name: string;
  events: AquaCropPlanEvent[];
}

export interface AquaCropNameId {
  id: string;
  name: string;
}

export interface AquaCropPlanEvent {
  _id?: string;
  name: string;
  category?: string;
  activityType?: string;
  range: AquaCropRange;
  details?: AquaCropDetails;
}

export interface AquaCropEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: AquaCropNameId;
  location: Coordinate;
  photoRecords: AquaCropPhotoRecord[];
  audioRecords: AquaCropAudioRecord[];
  documentRecords: AquaCropDocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
}

export interface AquaCropField {
  id: string;
  name: string;
  fbId: string;
}

export interface AquaCropDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

export interface AquaCropPlanElement {
  _id: string;
  name: string;
  events: AquaCropPlanEvent[];
  category: string;
  status: string;
}

export enum AquaCropEventType {
  Submissions = 'Submissions',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

export enum AquaCropTimelineEventType {
  LandPreparation = 'shed_preparation',
  AquaCropIntervention = 'aquacrop_intervention',
  SeedProcessing = 'chick_processing',
}

export interface AquaCropFormData {
  [key: string]: any;
}
