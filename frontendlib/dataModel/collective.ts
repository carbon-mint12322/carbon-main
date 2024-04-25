import { LPEvent } from '~/frontendlib/dataModel/landParcel';

export interface Collective {
  _id: string;
  name: string;
  slug: string;
  category: string;
  id: string;
  address: CollectiveAddress;
  validationWorkflowId?: string;
  email: string;
  poc: string;
  plan: any;
  phone: string;
  schemes: any;
  schemeslist: any;
  documents: any;
  history: any;
  farmTractors: any;
  farmMachineries: any;
  farmTools: any;
  farmEquipments: any;
  mastercrops: any;
  collectivedocuments: any;
  collectivedisputes: any;
  collectivecomplaints: any;
  collectivesamplings: any;
  collectivesanctions: any;
  collectiveinspections: any;
  transactioncertificates: any;
  collectivescopecerts: any;
  collectiveinputlogs: any;

  collectiveinputpermissions: any;
  collectivevalidations: any;
  collectiveschemes: any;
  collectiveevaluations: any;
  collectivenonconfirmitys: any;
  collectivengmotestrecords: any;
  collectivegroups: any;
  collectivesubgroups: any;
  farmerosps: any;
  farmerinspctions: any;
  organicsystemplans: any;
  harvestupdates: any;
  aggregationplans: any;
  users: any;
  histories: any;
  mandator: any;
  fpoDetails: any;
  fpcDetails: any;
  events: LPEvent[];
  status: string;
}

export interface CollectiveAddress {
  village: string;
  state: string;
  pincode: string;
}

export interface SchemeDetails {
  id: string;
  name: string;
}

export interface CollectiveFormData {
  [key: string]: any;
}
