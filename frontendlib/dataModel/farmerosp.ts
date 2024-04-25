export interface FarmerOSP {
  id: string;
  _id: string;
  landParcel: string;
  landParcelList: any;
  foId: string;
  year: number;
  totalArea: number;
  latitude: string;
  longitude: string;
  crops: any;
  remarks: any;
}

export interface FarmerOSPFormData {
  [key: string]: any;
}
