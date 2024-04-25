import { Status } from 'hooks/useLazyFetch';

export interface Farmer {
  _id: string;
  personalDetails: FarmerPersonalDetails;
  personalOrgDetails: FarmerPersonalOrgDetails;
  farmingExperience: FarmerFarmingExperience;
  processingExperience: number;
  farmerId: string;
  processorId: string;
  landParcels: FarmerLandParcel[];
  crops: FarmerCrop[];
  id: string;
  status: string;
  gender: string;
  dob: string;
  statusNotes?: string;
  validationWorkflowId?: string;
  documents: any;
  history: any;
  histories: any;
  type: string;
  inspectionDetails: any;
}

export interface FarmerCrop {
  _id: string;
  name: string;
  areaInAcres: number;
  croppingSystem: string;
  estimatedYieldTonnes: number;
  id: string;
}

export interface FarmerFarmingExperience {
  agriAlliedActivitiesExperience: string;
  cropsWithOrganicFarmingExperience: string;
  organicFarmingExperienceYears: number;
  totalFarmingExperienceYears: number;
  livestockExperience: number;
}

export interface FarmerLandParcel {
  _id: string;
  name: string;
  surveyNumber: string;
  areaInAcres: number;
  own: string;
  address: FarmerLandParcelAddress;
  id: string;
}

export interface FarmerLandParcelAddress {
  village: string;
  mandal: string;
  state: string;
  pincode: string;
}

export interface FarmerPersonalDetails {
  identityNumber: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  address: FarmerPersonalDetailsAddress;
  fathersName: string;
  profilePicture: string;
}

export interface FarmerPersonalDetailsAddress {
  village: string;
  state: string;
}

export interface FarmerPersonalOrgDetails {
  orgName: string;
  identificationNumber: string;
  joiningDate: string;
}

export interface FarmerFormData {
  [key: string]: any;
}
