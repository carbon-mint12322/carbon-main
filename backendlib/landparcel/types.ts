import { ObjectId } from 'mongodb';

export interface LandParcel {
  _id: ObjectId;
  name: string;
  surveyNumber: string;
  passbookNumber: string;
  areaInAcres: number;
  landOwner: LandOwner;
  address: LandParcelAddress;
  climateScore: number;
  complianceScore: number;
  collective: string;
  status: string;
  active: boolean;
  map: string;
  location: Location;
  landOwnershipDocument: string;
  waterSources: WaterSource[];
}

export interface WaterSource {
  _id: ObjectId;
}

export interface LandOwner {
  address: LandOwnerAddress;
  identityDetails: IdentityDetails;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  fathersHusbandsName: string;
  profilePicture: string;
}

export interface LandOwnerAddress {
  village: string;
  state: string;
  pincode: string;
  mandal: string;
}

export interface IdentityDetails {
  identityNumber: string;
  identityDocument: string;
  identityDocumentFile: string;
}

export interface LandParcelAddress {
  village: string;
  state: string;
  pincode: string;
  mandal: string;
}

export interface Location {
  lat: number;
  lng: number;
}
