export interface CollectiveInputLog {
  id: string;
  _id: string;
  ilId: string;
  materialName: string;
  brandName: string;
  inputType: string;
  dateOfPurchase: string;
  purpose: string;
  billingInformation: string;
  labelInformation: string;
  specificationsAndSafety: string;
  sourceOfPurchase: string;
  sourceContact: string;
  totalExpenditure: number;
  otherRemarks: string;

  collective: string;
}

export interface CollectiveInputLogFormData {
  [key: string]: any;
}
