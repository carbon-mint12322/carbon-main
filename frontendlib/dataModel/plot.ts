export interface Plot {
  _id: string;
  name: string;
  id: string;
  map: string;
  area: string;
  landParcel: string;
  category: string;
  collective: string;
  active: boolean;
  status: string;
  farmers: any;
  landParcels: any;
  crops: any;
}

export interface PlotFormData {
  [key: string]: any;
}
