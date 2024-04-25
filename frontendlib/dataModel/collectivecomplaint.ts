export interface CollectiveComplaint {
  id: string;
  _id: string;
  ccId: string;
  complaintDate: string;
  complaintName: string;
  contact: string;
  description: string;

  location: string;
  complaintType: string;
  assignedTo: string;
  priorityLevel: string;
  status: string;
  closureConfirmation: string;
  attachments: any;
  collective: string;
}

export interface CollectiveComplaintFormData {
  [key: string]: any;
}
