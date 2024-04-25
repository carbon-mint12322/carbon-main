export interface AggregationPlan {
  id: string;
  _id: string;
  name: string;
  hu: any;
  cb: any;
  cbs: any;
  hus: any;
  apId: string;
  startDate: string;
  endDate: string;
  crop: string;
  variety: string;
  otherRemarks: string;
  attachments: any;
  lotNo: string;
  ospGrid: any;
  active: boolean;
  collective: string;
}

export interface AggregationPlanFormData {
  [key: string]: any;
}
