export interface CollectiveNGMOTestRecord {
  id: string;
  _id: string;
  ntId: string;
  crops: any;
  cropName: string;
  sampleId: string;
  sampleFromTracedCrop: string;
  crop: string;
  farmerName: string;
  farmerId: string;
  sampleType: string;
  seedSource: string;
  seedVariety: string;
  seedCertificate: any;
  authority: string;
  natureOfSample: string;
  processingType: string;
  sampleReceivedDate: string;
  sampleQuantity: string;
  sampleCondition: string;
  sampleQC: string;
  sampleNumberPassedByQC: string;
  sampleIDPassedByQC: string;
  sampleNumberFailedByQC: string;
  sampleIDFailedByQC: string;
  testStart: string;
  testEnd: string;
  technicalScientist: string;
  qcIncharge: string;
  approvedBy: string;
  approvalSignature: string;
  labReports: any;
  laboratory: string;
  labCertifiedByNabl: string;
  nablCertificationEvidence: any;
  totalExpenditure: string;
  seedBTQRCodeUrls: any;
  otherRemarks: string;
  collective: string;
}

export interface CollectiveNGMOTestRecordFormData {
  [key: string]: any;
}
