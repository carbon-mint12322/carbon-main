import { ObjectId } from 'mongodb';

export interface ControlPoint {
  activityType: string;
  days: Days;
  repeated?: boolean;
  name: string;
  period: string;
  frequency?: number;
  ends?: number;
  technicalAdvice?: string;
  ccp?: boolean;
  serviceCatalogIds?: any;
  impactParameters?: any;
  inputs?: any;
}

export interface CompliancePoint {
  name: string;
  severity: string;
  description: string;

  score: number;
  days: Days;
  repeated?: boolean;
  frequency?: number;
  ends?: number;
}

export interface Days {
  start: number;
  end: number;
}


export interface SchemePop {
  _id: ObjectId;
  compliancePoints: Array<{ _id: ObjectId } & CompliancePoint>;
}

export interface Pop {
  _id: ObjectId;
  controlPoints: Array<{ _id: ObjectId } & ControlPoint>;
}

export interface CropPopType {
  season: string;
  durationType: string;
  scheme?: string;
  name: string;
  variety: string;
  region: string;
  durationDays: number;
}

export interface PopDetails {
  name: string;
  description: string;
  recommendedBy: string;
}

export interface SchemePopDetails {
  name: string;
  description: string;
}

export interface PopFromExcel extends PopDetails {
  cropPopType: CropPopType;
  controlPoints: ControlPoint[];
}


export interface SchemePopFromExcel extends SchemePopDetails {
  certificationAuthority: string;
  duration: string;
  description: string;
  name: string;
  responsibleParty: string;
  scope: string;
  compliancePoints: CompliancePoint[];
}

