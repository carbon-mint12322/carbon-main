export interface CollectiveInspection {
  id: string;
  _id: string;
  ciId: string;
  startDate: string;
  endDate: string;

  cb: any;
  cbs: any;
  inspectionDoneBy: string;
  reports: any;
  notes: string;
  collective: string;
}

export interface CollectiveInspectionFormData {
  [key: string]: any;
}
