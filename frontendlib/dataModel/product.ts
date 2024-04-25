export interface Product {
  _id: string;
  name: string;
  productId: string;
  category: string;
  type: string;
  description: string;
  documentation: string;
  complianceRequirements: string;
  compliance: string;
  complianceNotes: string;
  history: any;
  documents: any;
}

export interface ProductFormData {
  [key: string]: any;
}
