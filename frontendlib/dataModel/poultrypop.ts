export interface PoultryPOP {
  _id: string;
  name: string;
  controlPoints: PoultryControlPoint[];
  poultryPopType: PoultryPOPType;
  season: string;
  status: string;
  documents: any;
  history: any;
  histories: any;
  id: string;
}

interface PoultryPOPType {
  poultryType: string;
  variety: string;
  region: string;
  durationDays: number;
  scheme: string;
}

interface PoultryControlPoint {
  name: string;
  activityType: string;
  period: string;
  days: Range;
  technicalAdvice: string;
  mandatory: boolean;
  ccp: boolean;
  repeated: boolean;
  frequency: Number;
  ends: Number;
}

interface Range {
  start: number;
  end: number;
}

export interface PoultryPOPFormData {
  [key: string]: any;
}
