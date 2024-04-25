export interface CollectiveScopeCert {
  id: string;
  _id: string;
  scId: string;
  cb: any;
  cbs: any;
  issuedDate: string;
  expiryDate: string;
  effectiveDate: string;
  scheme: string;
  scope: string;
  conversionStatus: string;
  attachments: any;
  collective: string;
}

export interface CollectiveScopeCertFormData {
  [key: string]: any;
}
