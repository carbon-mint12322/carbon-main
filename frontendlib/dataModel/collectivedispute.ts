export interface CollectiveDispute {
  id: string;
  _id: string;
  cdId: string;
  disputeDate: string;
  disputeParties: string;
  description: string;
  location: string;
  disputeType: string;
  assignedTo: string;
  priorityLevel: string;
  status: string;
  closureConfirmation: string;
  attachments: any;
  collective: string;
}

export interface CollectiveDisputeFormData {
  [key: string]: any;
}
