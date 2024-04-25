export interface FarmerInspection {
  id: string;
  _id: string;
  landParcel: string;
  year: string;
  inspectionNo: string;
  landParcelList: any;
  fiId: string;
  inspectionDate: string;
  inspector: string;
  crops: any;
  reports: string;
  results: string;
  notes: any;
}

export interface FarmerInspectionFormData {
  [key: string]: any;
}
