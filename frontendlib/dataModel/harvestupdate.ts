export interface HarvestUpdate {
  id: string;
  _id: string;
  huId: string;
  startDate: string;
  endDate: string;
  ospYear: string;
  otherRemarks: string;
  ospGrid: any;
  name: string;
  active: boolean;
  attachements: any;
  collective: string;
}

export interface HarvestUpdateFormData {
  [key: string]: any;
}
