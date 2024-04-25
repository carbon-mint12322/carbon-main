import { getModel } from '../db/adapter';
import { getAjvValidator } from '../util/getAjvValidator';
import { ModelParams } from './types';
import WaterSourcesSchemaJson from '~/gen/jsonschemas/landparcel_waterSources.json';
import PowerSourcesSchemaJson from '~/gen/jsonschemas/landparcel_powerSources.json';
import SolarDryerUnitsSchemaJson from '~/gen/jsonschemas/landparcel_solarDryerUnits.json';
import CompostingUnitsSchemaJson from '~/gen/jsonschemas/landparcel_compostingUnits.json';
import OutputProcessingUnitsSchemaJson from '~/gen/jsonschemas/landparcel_outputProcessingUnits.json';
import InputProcessingUnitsSchemaJson from '~/gen/jsonschemas/landparcel_inputProcessingUnits.json';
import SeedProcessingUnitsSchemaJson from '~/gen/jsonschemas/landparcel_seedProcessingUnits.json';
import StoreUnitsSchemaJson from '~/gen/jsonschemas/landparcel_storeUnits.json';
import FarmhousesSchemaJson from '~/gen/jsonschemas/landparcel_farmhouses.json';
import ToiletsSchemaJson from '~/gen/jsonschemas/landparcel_toilets.json';
import LaborQuartersSchemaJson from '~/gen/jsonschemas/landparcel_laborQuarters.json';
import SecurityHousesSchemaJson from '~/gen/jsonschemas/landparcel_securityHouses.json';
import ScrapShedsSchemaJson from '~/gen/jsonschemas/landparcel_scrapSheds.json';
import MedicalAssistancesSchemaJson from '~/gen/jsonschemas/landparcel_medicalAssistances.json';
import DiningsSchemaJson from '~/gen/jsonschemas/landparcel_dinings.json';
import AttractionsSchemaJson from '~/gen/jsonschemas/landparcel_attractions.json';

import FarmTractorsSchemaJson from '~/gen/jsonschemas/farmTractors.json';
import FarmMachineriesSchemaJson from '~/gen/jsonschemas/farmMachineries.json';
import FarmToolsSchemaJson from '~/gen/jsonschemas/farmTools.json';
import FarmEquipmentsSchemaJson from '~/gen/jsonschemas/farmEquipments.json';

import FarmerOSPSchemaJson from '~/gen/jsonschemas/add_farmerosp.json';
import FarmerSchemeSchemaJson from '~/gen/jsonschemas/add_farmerscheme.json';
import FarmerInspectionSchemaJson from '~/gen/jsonschemas/add_farmerinspection.json';

import AggregationPlanSchemaJson from '~/gen/jsonschemas/add_aggregationplan.json';
import NestedDocumentSchemaJson from '~/gen/jsonschemas/nestedSupportDocuments.json';
import CollectiveCompliantSchemaJson from '~/gen/jsonschemas/add_collectivecomplaint.json';
import CollectiveDisputeSchemaJson from '~/gen/jsonschemas/add_collectivedispute.json';
import CollectiveDocumentSchemaJson from '~/gen/jsonschemas/add_collectivedocument.json';
import CollectiveEvaluationSchemaJson from '~/gen/jsonschemas/add_collectiveevaluation.json';
import CollectiveGroupSchemaJson from '~/gen/jsonschemas/add_collectivegroup.json';
import CollectiveInputLogSchemaJson from '~/gen/jsonschemas/add_collectiveinputlog.json';
import CollectiveInputPermissionSchemaJson from '~/gen/jsonschemas/add_collectiveinputpermission.json';
import CollectiveInspectionSchemaJson from '~/gen/jsonschemas/add_collectiveinspection.json';
import CollectiveNonConfirmitySchemaJson from '~/gen/jsonschemas/add_collectivenonconfirmity.json';
import CollectiveNGMOTestSchemaJson from '~/gen/jsonschemas/add_collectivengmotestrecord.json';
import CollectiveSamplingSchemaJson from '~/gen/jsonschemas/add_collectivesampling.json';
import CollectiveSanctionSchemaJson from '~/gen/jsonschemas/add_collectivesanction.json';
import CollectiveScopeCertificationSchemaJson from '~/gen/jsonschemas/add_collectivescopecert.json';
import CollectiveSubGroupSchemaJson from '~/gen/jsonschemas/add_collectivesubgroup.json';
import CollectiveValidationSchemaJson from '~/gen/jsonschemas/add_collectivevalidation.json';
import CollectiveSchemeSchemaJson from '~/gen/jsonschemas/add_collectivescheme.json';
import CollectiveHarvestUpdateSchemaJson from '~/gen/jsonschemas/add_harvestupdate.json';
import { createFarmerOSP } from '../functions/createFarmerOSP';
import { createCollectiveHarvestUpdate } from '../functions/createCollectiveHarvestUpdate';

const FarmerSchemaId = '/farmbook/farmer';
const FarmerModel = getModel(FarmerSchemaId);
const ProcessorSchemaId = '/farmbook/processor';
const ProcessorModel = getModel(ProcessorSchemaId);
const CollectiveSchemaId = '/farmbook/collective';
const CollectiveModel = getModel(CollectiveSchemaId);
const ProductSchemaId = '/farmbook/product';
const ProductModel = getModel(ProductSchemaId);
const CropSchemaId = '/farmbook/crop';
const CropModel = getModel(CropSchemaId);

const config: { [key: string]: Omit<ModelParams, 'childResourceParamName' | 'schema' | 'model'> } = {
  waterSources: {
    uiSchema: 'landparcel_waterSources',
    validator: getAjvValidator(WaterSourcesSchemaJson),
  },
  powerSources: {
    uiSchema: 'landparcel_powerSources',
    validator: getAjvValidator(PowerSourcesSchemaJson),
  },
  solarDryerUnits: {
    uiSchema: 'landparcel_solarDryerUnits',
    validator: getAjvValidator(SolarDryerUnitsSchemaJson),
  },
  compostingUnits: {
    uiSchema: 'landparcel_compostingUnits',
    validator: getAjvValidator(CompostingUnitsSchemaJson),
  },
  outputProcessingUnits: {
    uiSchema: 'landparcel_outputProcessingUnits',
    validator: getAjvValidator(OutputProcessingUnitsSchemaJson),
  },
  inputProcessingUnits: {
    uiSchema: 'landparcel_inputProcessingUnits',
    validator: getAjvValidator(InputProcessingUnitsSchemaJson),
  },
  seedProcessingUnits: {
    uiSchema: 'landparcel_seedProcessingUnits',
    validator: getAjvValidator(SeedProcessingUnitsSchemaJson),
  },
  storeUnits: {
    uiSchema: 'landparcel_storeUnits',
    validator: getAjvValidator(StoreUnitsSchemaJson),
  },
  farmhouses: {
    uiSchema: 'landparcel_farmhouses',
    validator: getAjvValidator(FarmhousesSchemaJson),
  },
  toilets: {
    uiSchema: 'landparcel_toilets',
    validator: getAjvValidator(ToiletsSchemaJson),
  },
  laborQuarters: {
    uiSchema: 'landparcel_laborQuarters',
    validator: getAjvValidator(LaborQuartersSchemaJson),
  },
  securityHouses: {
    uiSchema: 'landparcel_securityHouses',
    validator: getAjvValidator(SecurityHousesSchemaJson),
  },
  scrapSheds: {
    uiSchema: 'landparcel_scrapSheds',
    validator: getAjvValidator(ScrapShedsSchemaJson),
  },
  medicalAssistances: {
    uiSchema: 'landparcel_medicalAssistances',
    validator: getAjvValidator(MedicalAssistancesSchemaJson),
  },
  dinings: {
    uiSchema: 'landparcel_dinings',
    validator: getAjvValidator(DiningsSchemaJson),
  },
  attractions: {
    uiSchema: 'landparcel_attractions',
    validator: getAjvValidator(AttractionsSchemaJson),
  },
  farmTractors: {
    uiSchema: 'farmTractors',
    validator: getAjvValidator(FarmTractorsSchemaJson),
  },
  farmMachineries: {
    uiSchema: 'farmMachineries',
    validator: getAjvValidator(FarmMachineriesSchemaJson),
  },
  farmTools: {
    uiSchema: 'farmTools',
    validator: getAjvValidator(FarmToolsSchemaJson),
  },
  farmEquipments: {
    uiSchema: 'farmEquipments',
    validator: getAjvValidator(FarmEquipmentsSchemaJson),
  },
  osps: {
    uiSchema: 'nested_farmerosp',
    validator: getAjvValidator(FarmerOSPSchemaJson),
    createFn: createFarmerOSP,
  },
  schemes: {
    uiSchema: 'add_farmerscheme',
    validator: getAjvValidator(FarmerSchemeSchemaJson),
  },
  processorSchemes: {
    uiSchema: 'add_farmerscheme',
    validator: getAjvValidator(FarmerSchemeSchemaJson),
  },
  inspectionDetails: {
    uiSchema: 'add_farmerinspection',
    validator: getAjvValidator(FarmerInspectionSchemaJson),
  },
  aggregationPlanDetails: {
    uiSchema: 'nested_aggregationplan',
    validator: getAjvValidator(AggregationPlanSchemaJson),
  },
  compliantDetails: {
    uiSchema: 'add_collectivecomplaint',
    validator: getAjvValidator(CollectiveCompliantSchemaJson),
  },
  disputeDetails: {
    uiSchema: 'add_collectivedispute',
    validator: getAjvValidator(CollectiveDisputeSchemaJson),
  },
  documentDetails: {
    uiSchema: 'add_collectivedocument',
    validator: getAjvValidator(CollectiveDocumentSchemaJson),
  },
  documents: {
    uiSchema: 'nestedSupportDocuments',
    validator: getAjvValidator(NestedDocumentSchemaJson),
  },
  evaluationDetails: {
    uiSchema: 'add_collectiveevaluation',
    validator: getAjvValidator(CollectiveEvaluationSchemaJson),
  },
  groups: {
    uiSchema: 'add_collectivegroup',
    validator: getAjvValidator(CollectiveGroupSchemaJson),
  },
  inputLogs: {
    uiSchema: 'add_collectiveinputlog',
    validator: getAjvValidator(CollectiveInputLogSchemaJson),
  },
  inputPermissionDetails: {
    uiSchema: 'add_collectiveinputpermission',
    validator: getAjvValidator(CollectiveInputPermissionSchemaJson),
  },
  internalInspectionDetails: {
    uiSchema: 'add_farmerinspection',
    validator: getAjvValidator(FarmerInspectionSchemaJson),
  },
  externalInspectionDetails: {
    uiSchema: 'add_collectiveinspection',
    validator: getAjvValidator(CollectiveInspectionSchemaJson),
  },
  nonConfirmityDetails: {
    uiSchema: 'add_collectivenonconfirmity',
    validator: getAjvValidator(CollectiveNonConfirmitySchemaJson),
  },
  ngmoTestRecords: {
    uiSchema: 'nested_collectivengmotestrecord',
    validator: getAjvValidator(CollectiveNGMOTestSchemaJson),
  },
  samplingDetails: {
    uiSchema: 'nested_collectivesampling',
    validator: getAjvValidator(CollectiveSamplingSchemaJson),
  },
  sanctionDetails: {
    uiSchema: 'add_collectivesanction',
    validator: getAjvValidator(CollectiveSanctionSchemaJson),
  },
  scopeCertificationDetails: {
    uiSchema: 'add_collectivescopecert',
    validator: getAjvValidator(CollectiveScopeCertificationSchemaJson),
  },
  subGroups: {
    uiSchema: 'add_collectivesubgroup',
    validator: getAjvValidator(CollectiveSubGroupSchemaJson),
  },
  validationDetails: {
    uiSchema: 'add_collectivevalidation',
    validator: getAjvValidator(CollectiveValidationSchemaJson),
  },
  schemeDetails: {
    uiSchema: 'add_collectivescheme',
    validator: getAjvValidator(CollectiveSchemeSchemaJson),
  },
  harvestUpdateDetails: {
    uiSchema: 'nested_harvestupdate',
    validator: getAjvValidator(CollectiveHarvestUpdateSchemaJson),
    createFn: createCollectiveHarvestUpdate,
  }
};
export default config;
