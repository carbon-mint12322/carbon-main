import { Coordinate } from '~/utils/coordinatesFormatter';
export interface Field {
  _id: string;
  fbId: string;
  name: string;
  areaInAcres: string;
  calculatedAreaInAcres: string;
  map: string;
  fieldType: string;
  active: boolean;
  landParcelDetails: lpDetails[];
  farmer: farmerDetails[];
  croppingSystem: csDetails[];
  crops: fpCrop[];
  id: string;
  histories: any;
  landParcelMap: boolean;
}

export interface fpCrop {
  _id: string;
  name: string;
  areaInAcres: number;
  croppingSystem: string;
  estimatedYieldTonnes: number;
  id: string;
}

export interface csDetails {
  name: string;
}

export interface farmerDetails {
  _id: string;
  personalDetails: fpFarmerPersonalDetails;
}

export interface fpFarmerPersonalDetails {
  firstName: string;
  lastName: string;
}

export interface lpDetails {
  _id: string;
  name: string;
  location: string;
  map: string;
  address: fpFarmerLandParcelAddress;
}

export interface fpFarmerLandParcelAddress {
  village: string;
}

export interface FieldFormData {
  [key: string]: any;
}
