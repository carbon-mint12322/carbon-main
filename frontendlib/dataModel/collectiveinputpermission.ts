export interface CollectiveInputPermission {
  id: string;
  _id: string;
  ipId: string;
  applicationDate: string;
  cb: any;
  cbs: any;
  seedsApproval: any;
  fertilizerApproval: any;
  areas: any;
  soilAnalysis: any;
  assessorRecommondation: string;
  assessorName: string;
  assessorDate: string;
  cbApproval: string;
  qualityManager: string;
  approvalDate: string;
  attchments: any;
  otherRemarks: string;
  collective: string;
}

export interface CollectiveInputPermissionFormData {
  [key: string]: any;
}
