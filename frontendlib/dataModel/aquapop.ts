export interface AquaPOP {
  _id: string;
  name: string;
  aquaControlPoints: AquaControlPoint[];
  aquaPopType: AquaPOPType;
  season: string;
  status: string;
  documents: any;
  history: any;
  histories: any;
  id: string;
}

interface AquaPOPType {
  aquaType: string;
  variety: string;
  region: string;
  durationDays: number;
  scheme: string;
}

interface AquaControlPoint {
  name: string;
  activityType: string;
  period: string;
  days: Range;
  technicalAdvice: string;
  mandatory: boolean;
}

interface Range {
  start: number;
  end: number;
}

export interface AquaPOPFormData {
  [key: string]: any;
}
