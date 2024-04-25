import { LPEvent, LandParcel } from './landParcel';

export interface ProductBatch {
  _id: string;
  id: string;
  product: string;
  batchId: string;
  information: string;
  startDate: Date;
  endDate: Date;
  documents: string;
  history: string;
  productItem: any;
  events: LPEvent[];
  landparcels: LandParcel[];
  status: string;
  validationWorkflowId: string;
  qrLink?: string;
}

export interface ProductBatchFormData {
  [key: string]: any;
}
