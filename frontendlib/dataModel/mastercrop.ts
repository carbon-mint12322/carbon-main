export interface MasterCrop {
  id: string;
  _id: string;
  mcId: string;
  cropName: string;
  name: string;
  cropType: string;
  seedVariety: string;
  seedSource: string;
  season: string;
  otherGrowingSeason: string;
  status: string;
  active: boolean;
  collective: string;
}

export interface MasterCropFormData {
  [key: string]: any;
}
