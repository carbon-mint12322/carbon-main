import { Coordinate } from '~/utils/coordinatesFormatter';
import { NameId } from './crop';
import { PlanEventT } from '~/backendlib/types';

export interface Poultry {
  _id: string;
  batchIdName: string;
  size: number;
  breed: string;
  poultryType: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  chickPlacementDay: string;
  estHarvestDate: string;
  actualHarvestDate: string;
  actualYieldSize: number;
  actualYieldTonnes: number;
  actualChickPlacementDay: string;
  actualSize: number;
  purpose: string;
  chickSource: string;
  field: PoultryField;
  climateScore: number;
  complianceScore: number;
  status: string;
  poultryId: string;
  events: PoultryEvent[];
  plan: PoultryPlanElement[];
  fieldDetails: PoultryDetail[];
  landParcel: NameId;
  farmer: NameId;
  landParcelDetails: PoultryDetail[];
  id: string;
  entityProgress: PoultryProgress;
  scheduledEvents: PoultryScheduledEvents;
  category: any;
  documents: any;
  history: any;
  dayMortality: number;
  mortalityDate: string;
  cumulativeMortality: number;
  mortalityPercentage: number;
  weightGain: number;
  risk: string;
  feedStock: number;
  feedExpiry: string;
  qrLink?: string;
  costOfCultivation: number;
  validationWorkflowId?: string;
}

interface PoultryProgress {
  plan: PoultryProgressPlan;
  actual: PoultryActual;
}

interface PoultryActual {
  events: PoultryActualEvent[];
}

interface PoultryActualEvent {
  name: string;
  range: PoultryRange;
  details: PoultryDetails;
}

interface PoultryDetails {
  createdAt: string;
  photoRecords: PoultryPhotoRecord[];
  location: Coordinate;
  name: string;
}

interface PoultryPhotoRecord {
  link: string;
  metadata: PoultryMetadata;
}

interface PoultryScheduledEvents {
  plan: PoultryScheduledEventsPlan;
}

interface PoultryAudioRecord {
  link: string;
  metadata: PoultryMetadata;
}

interface PoultryDocumentRecord {
  link: string;
  metadata: PoultryMetadata;
}

interface PoultryMetadata {
  location: Coordinate;
  timestamp: Date;
}

interface PoultryRange {
  start: string;
  end: string;
}

interface PoultryProgressPlan {
  id: string;
  name: string;
  events: PoultryPlanEvent[];
}

interface PoultryScheduledEventsPlan {
  id: string;
  name: string;
  events: PoultryPlanEvent[];
}

interface PoultryNameId {
  id: string;
  name: string;
}

interface PoultryPlanEvent {
  _id?: string;
  name: string;
  category?: string;
  activityType?: string;
  range: PoultryRange;
  details?: PoultryDetails;
  eventStatus?: PlanEventT['eventStatus'];
  ccp: PlanEventT['ccp'];
}

interface PoultryEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: PoultryNameId;
  location: Coordinate;
  photoRecords: PoultryPhotoRecord[];
  audioRecords: PoultryAudioRecord[];
  documentRecords: PoultryDocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
}

interface PoultryField {
  id: string;
  name: string;
  fbId: string;
}

interface PoultryDetail {
  _id: string;
  location: Coordinate;
  map: string;
  id: string;
  fbId: string;
}

interface PoultryPlanElement {
  _id: string;
  name: string;
  events: PoultryPlanEvent[];
  category: string;
  status: string;
}

enum PoultryEventType {
  Submissions = 'Submission',
  Calendar = 'Calendar',
  Scheduled = 'Scheduled',
}

enum PoultryTimelineEventType {
  LandPreparation = 'shed_preparation',
  PoultryIntervention = 'poultry_intervention',
  SeedProcessing = 'chick_processing',
}

interface PoultryFormData {
  [key: string]: any;
}
