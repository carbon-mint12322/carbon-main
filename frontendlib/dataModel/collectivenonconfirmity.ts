export interface CollectiveNonConfirmity {
  id: string;
  _id: string;
  ncId: string;
  ncDate: string;
  cb: any;
  cbs: any;
  description: string;
  location: string;
  scope: string;
  severity: string;
  evidence: any;
  rca: string;
  correctiveActionPlan: string;
  targetDate: string;
  status: string;
  verification: string;
  notes: string;
  closureConfirmation: string;

  collective: string;
}

export interface CollectiveNonConfirmityFormData {
  [key: string]: any;
}
