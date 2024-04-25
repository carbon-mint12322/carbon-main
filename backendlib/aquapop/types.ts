import { ObjectId } from 'mongodb';

export interface AquaControlPoint {
  activityType: string;
  days: Days;
  repeated?: boolean;
  name: string;
  period: string;
  frequency?: number;
  ends?: number;
  technicalAdvice?: string;
  ccp?: boolean;
}

export interface Days {
  start: number;
  end: number;
}

export interface AquaPop {
  _id: ObjectId;
  controlPoints: Array<{ _id: ObjectId } & AquaControlPoint>;
}

export interface AquaPopType {
  aquaType: string;
  variety: string;
  region: string;
  scheme?: string;
  durationDays: number;
}

export interface AquaPopDetails {
  name: string;
  description: string;
  recommendedBy: string;
}

export interface AquaPopFromExcel extends AquaPopDetails {
  aquaPopType: AquaPopType;
  aquaControlPoints: AquaControlPoint[];
}
