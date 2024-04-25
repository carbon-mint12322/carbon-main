import { Coordinate } from '~/utils/coordinatesFormatter';
import { PlanEventT } from '~/backendlib/types';
import { AudioRecord, DocumentRecord, NameId, PhotoRecord, CropPlanElement } from '~/frontendlib/dataModel/crop';

export interface INestedProps {
  data: any;
  modelName: string;
  lpData: any;
  reFetch: () => void;
  lpMap: any;
}

export interface LandParcelNestedResource {
  compostingUnits: LandParcelCompostingUnit[];
  productionSystems: LandParcelProductionSystem[];
  processingSystems: LandParcelProcessingSystem[];
  waterSources: LandParcelAquaculture[];
  powerSources: LandParcelPowerSource[];
  solarDryerUnits: LandParcelSolarDryerUnit[];
  farmhouses: LandParcelFarmhouse[];
  toilets: LandParcelToilet[];
  laborQuarters: LandParcelLaborQuarter[];
  securityHouses: LandParcelSecurityHouse[];
  scrapSheds: LandParcelScrapShed[];
  medicalAssistances: LandParcelMedicalAssistance[];
  dinings: LandParcelDining[];
  attractions: LandParcelAttraction[];
  outputProcessingUnits: LandParcelOutputProcessingUnit[];
  inputProcessingUnits: LandParcelInputProcessingUnit[];
  seedProcessingUnits: LandParcelSeedProcessingUnit[];
  storeUnits: LandParcelStoreUnit[];
}

export interface LandParcel extends LandParcelNestedResource {
  id: string;
  _id: string;
  name: string;
  surveyNumber: string;
  areaInAcres: number;
  calculatedAreaInAcres: number;
  plan: CropPlanElement[];
  climateScore: number;
  complianceScore: number;
  status: string;
  farmer: LandParcelFarmer;
  processor: LandParcelProcessor;
  own: string;
  ownership: string;
  leaseDocuments: any;
  landownerRef: string;
  landOwner: LandOwnerDetails;
  landowners: any;
  location: Location;
  map: string;
  address: LandParcelAddress;
  adjacentLands: LandParcelAdjacentLands;
  crops: LandParcelCrop[];
  poultrybatches: LandParcelPoultryBatches[];
  aquacrops: LandParcelAquaCrops[];
  cows: LandParcelCows[];
  goats: LandParcelGoats[];
  sheeps: LandParcelSheeps[];
  fields: LandParcelField[];
  croppingSystems: LandParcelCroppingSystem[];
  plots: LandParcelPlot[];

  coreAgriculture: LandParcelCoreAgriculture;
  basicUtilities: LandParcelBasicUtilities;
  supportUtilities: LandParcelFacility[];
  processingUnits: LandParcelFacility[];
  landOwnershipDocument: string;
  landGovtMap: string;
  landSupportDocument: string;
  events: LPEvent[];
  alliedActivity: LandParcelAlliedActivity[];
  documents: any;
  schemes: any;
  soilInfo: any;
  farmTractors: any;
  farmMachineries: any;
  farmTools: any;
  farmEquipments: any;
  history: any;
  histories: any;

  validationWorkflowId?: string;
}






export interface LandParcelAddress {
  village: string;
  mandal: string;
  state: string;
  pincode: string;
}

export interface LandParcelAdjacentLands {
  north: string;
  south: string;
  east: string;
  west: string;
}

export interface LandParcelAlliedActivity {
  fields: LandParcelField[];
  poultryBatches: LandParcelPoultryBatches[];
  aquacrops: LandParcelAquaCrops[];
  cows: LandParcelCows[];
  goats: LandParcelGoats[];
  sheeps: LandParcelSheeps[];
  productionSystems: LandParcelProductionSystem[];
  category?: string;
  capacity?: string;
  name?: string;
  photoEvidence?: string;
  location?: Location;
  size?: number;
}

export interface LandParcelAquaculture {
  source: string;
  details: any;
  location: Location;
}

export interface Location {
  lng: number;
  lat: number;
}

export interface LandParcelBasicUtilities {
  waterSources: LandParcelAquaculture[];
  powerSources: LandParcelPowerSource[];
}

export interface LandParcelPowerSource {
  name: string;
  limitation: number;
  capacity: number;
  location: Location;
}

export interface LandParcelSolarDryerUnit {
  name: string;
  area: number;
  capacity: number;
  map: string;
}

export interface LandParcelToilet {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelLaborQuarter {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelSecurityHouse {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelCompostingUnit {
  name: string;
  type: string;
  capacity: number;
  map: string;
}

export interface LandParcelOutputProcessingUnit {
  name: string;
  type: string;
  capacity: number;
  map: string;
}

export interface LandParcelInputProcessingUnit {
  name: string;
  type: string;
  capacity: number;
  map: string;
}

export interface LandParcelSeedProcessingUnit {
  name: string;
  type: string;
  capacity: number;
  map: string;
}
export interface LandParcelStoreUnit {
  name: string;
  type: string;
  capacity: number;
  map: string;
}
export interface LandParcelScrapShed {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelMedicalAssistance {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelDining {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelAttraction {
  name: string;
  condition: string;
  capacity: number;
  map: string;
  id: string;
}

export interface LandParcelFarmhouse {
  name: string;
  size: number;
  condition: string;
  map: string;
  id: string;
}

export interface LandParcelCoreAgriculture {
  fields: LandParcelField[];
  crops: LandParcelCrop[];
  croppingSystems: LandParcelCroppingSystem[];
  plots: LandParcelPlot[];
}

export interface LandParcelField {
  id: string;
  fbId: string;
  name: string;
  areaInAcres: number;
  calculatedAreaInAcres: number;
  category: string;
  fieldType: string;
  location_lng: number;
  location_lat: number;
  map: string;
  landParcel_id: number;
  cropName?: string;
  crops?: LandParcelFieldCrop[];
  landParcelMap: boolean;
}

export interface LandParcelFieldCrop {
  id: string;
  name: string;
}

export interface LandParcelCroppingSystem {
  id: string;
  field: string;
  fieldId?: string;
  mainCrop?: string;
  landParcel?: string;
  name?: string;
  interCrop1?: string;
  interCrop2?: string;
  borderCrop?: string;
  coverCrop?: string;
  status?: string;
  category: string;
}

export interface LandParcelPlot {
  id: string;
  name?: string;
  field: string;
  category: string;
  area: string;
  status?: string;
  map?: string;
}

export interface LandParcelProductionSystem {
  id: string;
  name?: string;
  field: string;
  category: string;
  status?: string;
  landParcel?: string;
}

export interface LandParcelProcessingSystem {
  id: string;
  name?: string;
  field: string;
  category: string;
  status?: string;
  landParcel?: string;
}

export interface LandParcelCrop {
  id: string;
  name: string;
  landParcel: string;
  areaInAcres: number;
  estimatedYieldTonnes: number;
  croppingSystem: string;
  plot: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  plannedSowingDate: string;
  estHarvestDate: string;
  category: string;
  field_id: string;
  field: string;
  climateScore: number;
  complianceScore: number;
  seedVariety: string;
  seedSource: string;
  seedType: string;
  status: string;
  fbId: any;
}

export interface LandParcelPoultryBatches {
  id: string;
  batchIdName: string;
  size: number;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  chickPlacementDay: string;
  estHarvestDate: string;
  actualHarvestDate: string;
  actualYieldTonnes: number;
  actualYieldSize: number;
  purpose: string;
  chickSource: string;
  dayMortality: number;
  mortalityDate: string;
  cumulativeMortality: number;
  mortalityPercentage: number;
  weightGain: number;
  risk: string;
  poultryPop: string;
  feedStock: number;
  feedExpiry: string;

  field_id: string;
  field: string;
  climateScore: number;
  complianceScore: number;
  status: string;
}

export interface LandParcelAquaCrops {
  id: string;

  cropType: string;
  cropSubType: string;
  quantity: number;
  plannedStockingDate: string;
  estHarvestDate: string;
  estimatedYieldTonnes: string;
  seedVariety: string;
  seedSource: string;
  seedEvidence: string;
  seedCertificate: string;
  actualYieldTonnes: number;
  actualStockingDate: string;
  actualHarvestDate: string;
  costOfCultivation: number;
  aquaPop: string;
  productionSystem: string;
  field: string;
  status: string;
  climateScore: number;
  complianceScore: number;
  fbId: string;
}

export interface LandParcelCows {
  id: string;
  tagId: string;
  age: number;
  cowSource: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;

  field_id: string;
  field: string;
  climateScore: number;
  complianceScore: number;
  status: string;
}

export interface LandParcelGoats {
  id: string;
  tagId: string;
  age: number;
  goatSource: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;

  field_id: string;
  field: string;
  climateScore: number;
  complianceScore: number;
  status: string;
}

export interface LandParcelSheeps {
  id: string;
  tagId: string;
  age: number;
  sheepSource: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSYstem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;

  field_id: string;
  field: string;
  climateScore: number;
  complianceScore: number;
  status: string;
}

export interface LandParcelPoultryBatchDetails {
  batchIdName: string;
  size: number;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
  chickPlacementDay: string;
  estHarvestDate: string;
  actualHarvestDate: string;
  actualYieldTonnes: number;
  actualYieldSize: number;
  purpose: string;
  chickSource: string;
  dayMortality: number;
  mortalityDate: string;
  cumulativeMortality: number;
  mortalityPercentage: number;
  weightGain: number;
  risk: string;
  feedStock: number;
  feedExpiry: string;
}

export interface LandParcelAquaCropDetails {
  cropType: string;
  cropSubType: string;
  quantity: number;
  plannedStockingDate: string;
  estHarvestDate: string;
  estimatedYieldTonnes: number;
  seedVariety: string;
  seedSource: string;
  seedEvidence: string;
  seedCertificate: string;
  actualYieldTonnes: number;
  actualStockingDate: string;
  actualHarvestDate: string;
  costOfCultivation: number;
  risk: string;
}

export interface LandParcelCowInfo {
  tagId: string;
  age: number;
  cowSource: string;
  pedigree: string;
  gender: string;
  breed: string;
  productionSystem: string;
  startDate: string;
  farmer_id: string;
  farmer_name: string;
}

export interface LandParcelFarmer {
  id: number;
  personalDetails: FarmerDetails;
}
export interface LandParcelProcessor {
  id: number;
  personalDetails: ProcessorDetails;
}

export interface FarmerDetails {
  firstName: string;
  lastName: string;
}

export interface ProcessorDetails {
  firstName: string;
  lastName: string;
}

export interface LandOwnerDetails {
  firstName: string;
  lastName: string;
}

export interface LandParcelProcessing {
  facilities: LandParcelFacility[];
}

export interface LandParcelFacility {
  name: string;
  size: number;
  capacity?: number;
  category: string;
  location: Location;
}

export interface LandParcelFormData {
  [key: string]: any;
}

export interface LPEvent {
  _id: string;
  name: string;
  category: string;
  createdAt: string;
  createdBy: NameId;
  location: Coordinate;
  photoRecords: PhotoRecord[];
  audioRecords: AudioRecord[];
  documentRecords: DocumentRecord[];
  endDate: string;
  startDate: string;
  notes: string;
  id: string;
  details: any;
  markers: any;
}
