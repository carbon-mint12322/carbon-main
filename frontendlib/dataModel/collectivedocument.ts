export interface CollectiveDocument {
  id: string;
  _id: string;
  ceId: string;
  documentType: string;
  otherType: string;
  description: string;
  documentDate: string;
  documentOwner: string;
  status: string;
  attachments: any;
  collective: string;
  name: string;
}

export interface CollectiveDocumentFormData {
  [key: string]: any;
}
