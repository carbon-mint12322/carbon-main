export interface ProcessingSystem {
  _id: string;
  name: string;
  id: string;
  category: string;
  landParcels: any;
  landParcel: any;
}

export interface ProcessingSystemFormData {
  [key: string]: any;
}
