export interface POP {
  _id: string;
  name: string;
  description: string;
  recommendedBy: string;
  controlPoints: ControlPoint[];
  cropPopType: CropPOPType;
  season: string;
  status: string;
  documents: any;
  history: any;
  histories: any;
  id: string;
}

interface CropPOPType {
  name: string;
  variety: string;
  season: string;
  region: string;
  durationType: string;
  durationDays: number;
  scheme: string;
}

interface ControlPoint {
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
  serviceCatalogIds: any;
  impactParameters: any;
  inputs: any;
}

interface Range {
  start: number;
  end: number;
}

export interface POPFormData {
  [key: string]: any;
}
