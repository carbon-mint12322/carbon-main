import { PlanEventT } from '~/backendlib/types';
import { Coordinate } from '~/utils/coordinatesFormatter';

export interface Crop {
  _id: string;
  name: string;
  areaInAcres: number;
  croppingSystem: string;
  plot: string;
  masterCrop: string;
  estimatedYieldTonnes: number;
  actualYieldTonnes: number;
  landParcel: NameId;
  farmer: NameId;
  estHarvestDate: string;
  actualHarvestDate: string;
  season: string;
  otherGrowingSeason: string;
  cropType: string;
  seedVariety: string;
  seedSource: string;
  field: CropField;
  climateScore: number;
  complianceScore: number;
  status: string;
  cropId: string;
  events: CropEvent[];
  plan: CropPlanElement[];
  fieldDetails: CropDetail[];
  plotDetails: PlotDetail[];
  landParcelDetails: CropDetail[];
  id: string;
  entityProgress: CropProgress;
  scheduledEvents: ScheduledEvents;
  plannedSowingDate: any;
  actualSowingDate?: any;
  category: any;
  documents: any;
  history: any;
  histories: any;
  costOfCultivation: number;
  validationWorkflowId?: string;
  qrLink?: string;
  fbId?: any;
  cropTag?: string;
}

export interface CropProgress {
  plan: CropProgressPlan;
  actual: Actual;
}
export interface ScheduledEvents {
  plan: ScheduledEventsPlan;
}

export interface Actual {
  events: CropActualEvent[];
}

export interface CropActualEvent {
  _id?: string;
  name: string;
  range: Range;
  details: CropDetails;
}

export interface CropDetails {
  createdAt: string;
  photoRecords: PhotoRecord[];
  location: Coordinate;
  name: string;
  fbId: any;
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

export interface Range {
  start: string;
  end: string;
}

export interface CropProgressPlan {
  id: string;
  name?: string;
  events: CropPlanEvent[];
}

export interface ScheduledEventsPlan {
  id: string;
  name: string;
  events: CropPlanEvent[];
}

export interface CropPlanEvent {
  _id?: string;
  name: string;
  category?: string;
  activityType?: string;
  range: Range;
  details?: CropDetails;
  eventStatus?: PlanEventT['eventStatus'];
  ccp: PlanEventT['ccp'];
  planId?: string;
}

export interface CropEvent {
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

export interface NameId {
  id: string;
  name: string;
}

export interface CropField {
  id: string;
  name: string;
  fbId: string;
}

export interface CropDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

export interface PlotDetail {
  _id: string;
  area: number;
  fieldName: string;
  map: string;
  id: string;
}

export interface CropPlanElement {
  _id: string;
  name: string;
  events: CropPlanEvent[];
  category: string;
  status: string;
}

export enum CropEventType {
  Submissions = 'Submission',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

export enum CropTimelineEventType {
  LandPreparation = 'land_preparation',
  CropIntervention = 'crop_intervention',
  SeedProcessing = 'seed_processing',
}

export interface CropFormData {
  [key: string]: any;
}
