export interface CollectiveSubGroup {
  id: string;
  _id: string;
  csId: string;
  name: string;
  description: string;
  subGroupType: string;
  subGroupLeader: string;
  subGroupContact: string;
  status: string;
  creationDate: string;
  attachments: any;
  group: any;
  collective: string;
}

export interface CollectiveSubGroupFormData {
  [key: string]: any;
}
