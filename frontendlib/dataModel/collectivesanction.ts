export interface CollectiveSanction {
  id: string;
  _id: string;
  csId: string;
  sanctionDate: string;
  cb: any;
  cbs: any;
  sanctionType: string;
  description: string;
  sanctionPeriod: string;
  sanctionStatus: string;
  actions: string;
  responsibleParty: string;
  monitoring: string;
  review: string;
  notification: string;
  appealsProcess: string;
  closureConfirmation: string;
  attachments: any;
  collective: string;
}

export interface CollectiveSanctionFormData {
  [key: string]: any;
}
