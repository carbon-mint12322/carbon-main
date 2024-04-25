export interface CollectiveSampling {
  id: string;
  _id: string;
  csId: string;
  aggregationPlan: any;
  cb: any;
  cbs: any;
  aps: any;
  collectionDate: string;
  sampleCollector: string;
  description: string;
  lotNo: string;
  sampleType: string;
  sampleRefernce: string;
  testingMethod: string;
  testingLab: string;
  results: string;
  samplingeEvidences: string;
  status: string;
  otherRemarks: string;
  collective: string;
}

export interface CollectiveSamplingFormData {
  [key: string]: any;
}
