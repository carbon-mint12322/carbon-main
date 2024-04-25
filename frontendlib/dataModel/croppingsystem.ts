export interface CroppingSystem {
  _id: string;
  name: string;
  id: string;
  landParcel: string;
  category: string;
  collective: string;
  active: boolean;
  status: string;
  farmers: any;
  landParcels: any;
  crops: any;
}

export interface CroppingSystemFormData {
  [key: string]: any;
}
