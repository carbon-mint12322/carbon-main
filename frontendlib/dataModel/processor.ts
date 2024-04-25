import { Status } from 'hooks/useLazyFetch';

export interface Processor {
  _id: string;
  personalDetails: ProcessorPersonalDetails;
  personalOrgDetails: ProcessorPersonalOrgDetails;
  processingExperience: number;
  processorId: string;
  landParcels: ProcessorLandParcel[];

  id: string;
  status: string;
  gender: string;
  dob: string;
  statusNotes?: string;
  validationWorkflowId?: string;
  documents: any;
  history: any;
  histories: any;
}

export interface ProcessorLandParcel {
  _id: string;
  name: string;
  surveyNumber: string;
  areaInAcres: number;
  own: string;
  address: ProcessorLandParcelAddress;
  id: string;
}

export interface ProcessorLandParcelAddress {
  village: string;
  mandal: string;
  state: string;
  pincode: string;
}

export interface ProcessorPersonalDetails {
  identityNumber: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  address: ProcessorPersonalDetailsAddress;
  fathersName: string;
  profilePicture: string;
}

export interface ProcessorPersonalDetailsAddress {
  village: string;
  state: string;
}

export interface ProcessorPersonalOrgDetails {
  orgName: string;
  identificationNumber: string;
  joiningDate: string;
}

export interface ProcessorFormData {
  [key: string]: any;
}
