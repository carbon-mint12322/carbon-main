export interface CollectiveGroup {
  id: string;
  _id: string;
  cbId: string;
  name: string;
  description: string;
  groupType: string;
  groupLeader: string;
  groupContact: string;
  status: string;
  creationDate: string;
  attachments: any;
  collective: string;
}

export interface CollectiveGroupFormData {
  [key: string]: any;
}
