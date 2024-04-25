export interface CollectiveTransactionCert {
  id: string;
  _id: string;
  tcId: string;
  aggregationPlan: any;
  cb: any;
  cbs: any;
  aps: any;
  issuedDate: string;
  lotNo: string;
  attachments: any;
  otherRemarks: string;
  ngmoRecords: any;
  collective: string;
}

export interface CollectiveTransactionCertFormData {
  [key: string]: any;
}
