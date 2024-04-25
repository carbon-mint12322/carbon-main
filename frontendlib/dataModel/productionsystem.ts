import { AudioRecord, DocumentRecord, NameId, PhotoRecord, CropPlanElement } from '~/frontendlib/dataModel/crop';

export interface ProductionSystem {
  _id: string;
  name: string;
  id: string;
  category: string;
  landParcel: string;
  pondType: string;
  depth: number;
  shape: string;
  waterSource: string;
  aerationSystem: boolean;
  feedingArea: boolean;
  autoFeeders: boolean;
  waterInlet: boolean;
  waterOutlet: boolean;
  shadeStructures: boolean;
  otherInfra: string;
  constructionDate: string;
  additionalInfo: string;
  plan: CropPlanElement[];
}

export interface ProductionSystemFormData {
  [key: string]: any;
}
