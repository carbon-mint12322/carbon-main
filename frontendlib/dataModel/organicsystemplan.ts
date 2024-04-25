export interface OrganicSystemPlan {
  id: string;
  _id: string;
  ospYear: string;
  osId: string;

  icsDetails: any;
  seedDependencies: any;
  inputDependencies: any;
  bufferCrops: any;
  productionSystemOverview: any;
  conversionRequirements: any;
  postHarvestHandling: any;
  soilManagement: any;
  waterManagement: any;
  organicAwareness: any;
  buyBackDetails: any;
  internalInspectionstran: any;
  records: any;
  attachments: string;

  otherRemarks: string;

  active: boolean;
  collective: string;
}

export interface OrganicSystemPlanFormData {
  [key: string]: any;
}
