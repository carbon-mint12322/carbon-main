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
}

export interface Days {
  start: number;
  end: number;
}

export interface PoultryPop {
  _id: ObjectId;
  controlPoints: Array<{ _id: ObjectId } & ControlPoint>;
}

export interface PoultryPopType {
  poultryType : string;
  variety: string;
  region: string;
  scheme?: string;
  durationDays: number;
}

export interface PoultryPopDetails {
  name: string;
  description: string;
  recommendedBy: string;
}

export interface PoultryPopFromExcel extends PoultryPopDetails {
  poultryPopType: PoultryPopType;
  controlPoints: ControlPoint[];
}
