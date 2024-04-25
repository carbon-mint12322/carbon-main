export interface CollectiveValidation {
  id: string;
  _id: string;
  cdId: string;
  name: string;
  validationType: string;
  otherType: string;
  description: string;
  validationDate: string;
  doneBy: string;
  outcome: string;
  attachments: any;
  collective: string;
}

export interface CollectiveValidationFormData {
  [key: string]: any;
}
