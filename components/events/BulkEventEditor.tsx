import { NextRouter, useRouter } from 'next/router';
import NextProgress from 'next-progress';
import React, { useState, Suspense } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Paper
} from '@mui/material';
import Dialog from '~/components/lib/Feedback/Dialog';
import Button from '@mui/material/Button';
import { EventEditor } from '~/gen/workflows/index-fe';

function getWfStartSchemaName(wfName: string) {
    switch (wfName) {
        case 'agent-signup-example':
            return "agent";
        case 'certificationBodyAuditingReportWorkflow':
            return "certificationBodyAuditingReport";
        case 'certificationBodyInspectionReportWorkflow':
            return "certificationBodyInspectionReport";
        case 'collectiveHarvestHandlingWorkflow':
            return "postHarvestHandling";
        case 'collectiveInputLogWorkflow':
            return "inputLog";
        case 'cropInputLogWorkflow':
            return "inputLog";
        case 'cropSaleEventWorkflow':
            return "cropSaleEvent";
        case 'croppingSystemIntegratedCropCareDiseaseManagementWorkflow':
            return "diseaseManagementEvent";
        case 'croppingSystemIntegratedCropCarePestManagementWorkflow':
            return "pestManagementEvent";
        case 'croppingSystemIntegratedCropCarePreventiveMeasuresWorkflow':
            return "preventiveMeasuresEvent";
        case 'croppingSystemIntegratedCropCareWorkflow':
            return "integratedCropCareEvent";
        case 'croppingSystemIntegratedCropNutritionBioStimulantsWorkflow':
            return "nutritionBioStimulantsEvent";
        case 'croppingSystemIntegratedCropNutritionFertilizersWorkflow':
            return "nutritionFertilizerEvent";
        case 'croppingSystemIntegratedCropNutritionGeneralWorkflow':
            return "integratedCropNutritionEvent";
        case 'croppingSystemIntegratedCropNutritionManureWorkflow':
            return "nutritionManureEvent";
        case 'croppingSystemInterCulturalOperationsCropSpecificOperationWorkflow':
            return "interCulturalOperationsCropSpecificOperationEvent";
        case 'croppingSystemInterCulturalOperationsEarthingUpWorkflow':
            return "interCulturalOperationsEarthingUpEvent";
        case 'croppingSystemInterCulturalOperationsGapFillingWorkflow':
            return "interCulturalOperationsGapFillingEvent";
        case 'croppingSystemInterCulturalOperationsMulchingWorkflow':
            return "interCulturalOperationsMulchingEvent";
        case 'croppingSystemInterCulturalOperationsPruningWorkflow':
            return "interCulturalOperationsPruningEvent";
        case 'croppingSystemInterCulturalOperationsThinningWorkflow':
            return "interCulturalOperationsThinningEvent";
        case 'croppingSystemInterCulturalOperationsWeedingWorkflow':
            return "interCulturalOperationsWeedingEvent";
        case 'croppingSystemIrrigationWorkflow':
            return "irrigationEvent";
        case 'croppingSystemLandPrepBasicTillageWorkflow':
            return "landPrepBasicTillageEvent";
        case 'croppingSystemLandPrepDevelopmentWorkflow':
            return "landPrepDevelopmentEvent";
        case 'croppingSystemLandPrepLayoutWorkflow':
            return "landPrepLayoutEvent";
        case 'croppingSystemLandPrepOtherWorkflow':
            return "landPrepOtherEvent";
        case 'operatorInternalAuditingReportWorkflow':
            return "internalAuditingReport";
        case 'operatorInternalInspectionReportWorkflow':
            return "internalInspectionReport";
        case 'validation':
            return "add_notes";
        case 'add_collectivetransactioncertLifecycle':
            return "add_collectivetransactioncert";
        case 'add_farmerLifecycle':
            return "add_farmer";
        case 'add_poultryLifecycle':
            return "add_poultry";
        case 'add_processorLifecycle':
            return "add_processor";
        case 'add_productBatchLifecycle':
            return "add_productBatch";
        case 'aquaCropSoilInfoLifecycle':
            return "aquaCropSoilInfo";
        case 'aquaCropWaterTestLifecycle':
            return "aquaCropWaterTest";
        case 'aquaPSNonValidationLifecycleLifecycle':
            return "aquaPSNonValidationLifecycle";
        case 'aquaPSPondPreparationLifecycle':
            return "aquaPSPondPreparation";
        case 'aquacropAerationLifecycle':
            return "aquacropAeration";
        case 'aquacropAuditReportLifecycle':
            return "aquacropAuditReport";
        case 'aquacropDiagnosticTestLifecycle':
            return "aquacropDiagnosticTest";
        case 'aquacropEnergyUsageLifecycle':
            return "aquacropEnergyUsage";
        case 'aquacropFeedEfficiencyLifecycle':
            return "aquacropFeedEfficiency";
        case 'aquacropFeedLifecycle':
            return "aquacropFeed";
        case 'aquacropGrowthMeasurementLifecycle':
            return "aquacropGrowthMeasurement";
        case 'aquacropHarvestLifecycle':
            return "aquacropHarvest";
        case 'aquacropInputLogLifecycle':
            return "aquacropInputLog";
        case 'aquacropInspectionLifecycle':
            return "aquacropInspection";
        case 'aquacropLandUseLifecycle':
            return "aquacropLandUse";
        case 'aquacropMedicationLifecycle':
            return "aquacropMedication";
        case 'aquacropNonValidationLifecycleLifecycle':
            return "aquacropNonValidationLifecycle";
        case 'aquacropObservationsLifecycle':
            return "aquacropObservations";
        case 'aquacropOthersTestLifecycle':
            return "aquacropOthersTest";
        case 'aquacropPondPreparationLifecycle':
            return "aquacropPondPreparation";
        case 'aquacropPostHarvestProcessingLifecycle':
            return "aquacropPostHarvestProcessing";
        case 'aquacropPreventiveMeasuresLifecycle':
            return "aquacropPreventiveMeasures";
        case 'aquacropSeedProcurementLifecycle':
            return "aquacropSeedProcurement";
        case 'aquacropStockingLifecycle':
            return "aquacropStocking";
        case 'aquacropStockingNonValidationLifecycleLifecycle':
            return "aquacropStockingNonValidationLifecycle";
        case 'aquacropValidationLifecycleLifecycle':
            return "aquacropValidationLifecycle";
        case 'aquacropWasteManagementLifecycle':
            return "aquacropWasteManagement";
        case 'aquacropWaterUsageLifecycle':
            return "aquacropWaterUsage";
        case 'certificationBodyAuditingReportLifecycle':
            return "certificationBodyAuditingReport";
        case 'certificationBodyInspectionReportLifecycle':
            return "certificationBodyInspectionReport";
        case 'compostingHarvestEventLifecycle':
            return "compostingHarvestEvent";
        case 'compostingInputEventLifecycle':
            return "compostingInputEvent";
        case 'cowBirthLifecycle':
            return "cowBirth";
        case 'cowBreedingLifecycle':
            return "cowBreeding";
        case 'cowCalvingLifecycle':
            return "cowCalving";
        case 'cowFeedLifecycle':
            return "cowFeed";
        case 'cowFeedPSLifecycle':
            return "cowFeedPS";
        case 'cowMedicationLifecycle':
            return "cowMedication";
        case 'cowMedicationPSLifecycle':
            return "cowMedicationPS";
        case 'cowMilkingLifecycle':
            return "cowMilking";
        case 'cowMilkingPSLifecycle':
            return "cowMilkingPS";
        case 'cowNonValidationLifecycleLifecycle':
            return "cowNonValidationLifecycle";
        case 'cowPSNonValidationLifecycleLifecycle':
            return "cowPSNonValidationLifecycle";
        case 'cowPSValidationLifecycleLifecycle':
            return "cowPSValidationLifecycle";
        case 'cowSaleLifecycle':
            return "cowSale";
        case 'cowSalePSLifecycle':
            return "cowSalePS";
        case 'cowVaccinationLifecycle':
            return "cowVaccination";
        case 'cowVaccinationPSLifecycle':
            return "cowVaccinationPS";
        case 'cowValidationLifecycleLifecycle':
            return "cowValidationLifecycle";
        case 'cowWeaningLifecycle':
            return "cowWeaning";
        case 'cowWeightGrowthLifecycle':
            return "cowWeightGrowth";
        case 'cropSaleEventLifecycle':
            return "cropSaleEvent";
        case 'diseaseManagementEventLifecycle':
            return "diseaseManagementEvent";
        case 'entityValidationLifecycleLifecycle':
            return "entityValidationLifecycle";
        case 'estimatedYieldUpdateLifecycle':
            return "estimatedYieldUpdate";
        case 'farmResourcesOthersTestLifecycle':
            return "farmResourcesOthersTest";
        case 'farmerValidationLifecycleLifecycle':
            return "farmerValidationLifecycle";
        case 'goatBirthLifecycle':
            return "goatBirth";
        case 'goatBreedingLifecycle':
            return "goatBreeding";
        case 'goatCalvingLifecycle':
            return "goatCalving";
        case 'goatFeedLifecycle':
            return "goatFeed";
        case 'goatFeedPSLifecycle':
            return "goatFeedPS";
        case 'goatMedicationLifecycle':
            return "goatMedication";
        case 'goatMedicationPSLifecycle':
            return "goatMedicationPS";
        case 'goatMilkingLifecycle':
            return "goatMilking";
        case 'goatMilkingPSLifecycle':
            return "goatMilkingPS";
        case 'goatNonValidationLifecycleLifecycle':
            return "goatNonValidationLifecycle";
        case 'goatPSNonValidationLifecycleLifecycle':
            return "goatPSNonValidationLifecycle";
        case 'goatPSValidationLifecycleLifecycle':
            return "goatPSValidationLifecycle";
        case 'goatSaleLifecycle':
            return "goatSale";
        case 'goatSalePSLifecycle':
            return "goatSalePS";
        case 'goatVaccinationLifecycle':
            return "goatVaccination";
        case 'goatVaccinationPSLifecycle':
            return "goatVaccinationPS";
        case 'goatValidationLifecycleLifecycle':
            return "goatValidationLifecycle";
        case 'goatWeaningLifecycle':
            return "goatWeaning";
        case 'goatWeightGrowthLifecycle':
            return "goatWeightGrowth";
        case 'harvestDryingEventLifecycle':
            return "harvestDryingEvent";
        case 'harvestLabellingEventLifecycle':
            return "harvestLabellingEvent";
        case 'harvestPackingEventLifecycle':
            return "harvestPackingEvent";
        case 'harvestStorageEventLifecycle':
            return "harvestStorageEvent";
        case 'harvestThreshingEventLifecycle':
            return "harvestThreshingEvent";
        case 'harvestTransportationEventLifecycle':
            return "harvestTransportationEvent";
        case 'harvestWinnowingEventLifecycle':
            return "harvestWinnowingEvent";
        case 'harvestingEventLifecycle':
            return "harvestingEvent";
        case 'inputLogLifecycle':
            return "inputLog";
        case 'inputNonGMOTestLifecycle':
            return "inputNonGMOTest";
        case 'inputOffFarmFertilizerTestLifecycle':
            return "inputOffFarmFertilizerTest";
        case 'inputOthersTestLifecycle':
            return "inputOthersTest";
        case 'inputSeedTestLifecycle':
            return "inputSeedTest";
        case 'integratedCropCareEventLifecycle':
            return "integratedCropCareEvent";
        case 'integratedCropCareSimplifiedEventLifecycle':
            return "integratedCropCareSimplifiedEvent";
        case 'integratedCropNutritionEventLifecycle':
            return "integratedCropNutritionEvent";
        case 'integratedCropNutritionSimplifiedEventLifecycle':
            return "integratedCropNutritionSimplifiedEvent";
        case 'interCulturalOperationsCropSpecificOperationEventLifecycle':
            return "interCulturalOperationsCropSpecificOperationEvent";
        case 'interCulturalOperationsEarthingUpEventLifecycle':
            return "interCulturalOperationsEarthingUpEvent";
        case 'interCulturalOperationsGapFillingEventLifecycle':
            return "interCulturalOperationsGapFillingEvent";
        case 'interCulturalOperationsMulchingEventLifecycle':
            return "interCulturalOperationsMulchingEvent";
        case 'interCulturalOperationsPruningEventLifecycle':
            return "interCulturalOperationsPruningEvent";
        case 'interCulturalOperationsThinningEventLifecycle':
            return "interCulturalOperationsThinningEvent";
        case 'interCulturalOperationsWeedingEventLifecycle':
            return "interCulturalOperationsWeedingEvent";
        case 'internalAuditingReportLifecycle':
            return "internalAuditingReport";
        case 'internalInspectionReportLifecycle':
            return "internalInspectionReport";
        case 'internalInspectionReport_farmer_IndGAPLifecycle':
            return "internalInspectionReport_farmer_IndGAP";
        case 'irrigationEventLifecycle':
            return "irrigationEvent";
        case 'landPrepBasicTillageEventLifecycle':
            return "landPrepBasicTillageEvent";
        case 'landPrepDevelopmentEventLifecycle':
            return "landPrepDevelopmentEvent";
        case 'landPrepLayoutEventLifecycle':
            return "landPrepLayoutEvent";
        case 'landPrepOtherEventLifecycle':
            return "landPrepOtherEvent";
        case 'landPrepSimplifiedEventLifecycle':
            return "landPrepSimplifiedEvent";
        case 'lpEventNonValidationLifecycleLifecycle':
            return "lpEventNonValidationLifecycle";
        case 'lpImpactEventNonValidationLifecycleLifecycle':
            return "lpImpactEventNonValidationLifecycle";
        case 'lpInputLogLifecycle':
            return "lpInputLog";
        case 'lpOtherTestLifecycle':
            return "lpOtherTest";
        case 'lpOutputProcessingLifecycle':
            return "lpOutputProcessing";
        case 'lpSoilEventNonValidationLifecycleLifecycle':
            return "lpSoilEventNonValidationLifecycle";
        case 'lpSoilInfoLifecycle':
            return "lpSoilInfo";
        case 'lpWaterTestLifecycle':
            return "lpWaterTest";
        case 'nonValidationLifecycleLifecycle':
            return "nonValidationLifecycle";
        case 'nutritionBioStimulantsEventLifecycle':
            return "nutritionBioStimulantsEvent";
        case 'nutritionFertilizerEventLifecycle':
            return "nutritionFertilizerEvent";
        case 'nutritionManureEventLifecycle':
            return "nutritionManureEvent";
        case 'observationsLifecycle':
            return "observations";
        case 'otherEventLifecycle':
            return "otherEvent";
        case 'outputHeavyMetalsTestLifecycle':
            return "outputHeavyMetalsTest";
        case 'outputMicrobialTestLifecycle':
            return "outputMicrobialTest";
        case 'outputNonGMOTestLifecycle':
            return "outputNonGMOTest";
        case 'outputOthersTestLifecycle':
            return "outputOthersTest";
        case 'outputPesticideResidueTestLifecycle':
            return "outputPesticideResidueTest";
        case 'outputProcessingEventLifecycle':
            return "outputProcessingEvent";
        case 'pestManagementEventLifecycle':
            return "pestManagementEvent";
        case 'postHarvestHandlingLifecycle':
            return "postHarvestHandling";
        case 'postProcessingLifecycle':
            return "postProcessing";
        case 'poultryAuditReportLifecycle':
            return "poultryAuditReport";
        case 'poultryBatchValidationLifecycleLifecycle':
            return "poultryBatchValidationLifecycle";
        case 'poultryChickPlacmentNonValidationLifecycleLifecycle':
            return "poultryChickPlacmentNonValidationLifecycle";
        case 'poultryChicksPlacementLifecycle':
            return "poultryChicksPlacement";
        case 'poultryChicksProcurementLifecycle':
            return "poultryChicksProcurement";
        case 'poultryCullingLifecycle':
            return "poultryCulling";
        case 'poultryDiagnosticTestLifecycle':
            return "poultryDiagnosticTest";
        case 'poultryEggCollectionLifecycle':
            return "poultryEggCollection";
        case 'poultryEnergyUsageLifecycle':
            return "poultryEnergyUsage";
        case 'poultryFeedEfficiencyLifecycle':
            return "poultryFeedEfficiency";
        case 'poultryFeedLifecycle':
            return "poultryFeed";
        case 'poultryHarvestLifecycle':
            return "poultryHarvest";
        case 'poultryInputLogLifecycle':
            return "poultryInputLog";
        case 'poultryInspectionLifecycle':
            return "poultryInspection";
        case 'poultryLandUseLifecycle':
            return "poultryLandUse";
        case 'poultryLifecycle':
            return "poultry";
        case 'poultryMedicationLifecycle':
            return "poultryMedication";
        case 'poultryMortalityLifecycle':
            return "poultryMortality";
        case 'poultryMortalityNonValidationLifecycleLifecycle':
            return "poultryMortalityNonValidationLifecycle";
        case 'poultryNonValidationLifecycleLifecycle':
            return "poultryNonValidationLifecycle";
        case 'poultryObservationsLifecycle':
            return "poultryObservations";
        case 'poultryOthersTestLifecycle':
            return "poultryOthersTest";
        case 'poultryPSNonValidationLifecycleLifecycle':
            return "poultryPSNonValidationLifecycle";
        case 'poultryPSValidationLifecycleLifecycle':
            return "poultryPSValidationLifecycle";
        case 'poultryShedPSPreparationLifecycle':
            return "poultryShedPSPreparation";
        case 'poultryShedPreparationLifecycle':
            return "poultryShedPreparation";
        case 'poultryVaccinationLifecycle':
            return "poultryVaccination";
        case 'poultryValidationLifecycleLifecycle':
            return "poultryValidationLifecycle";
        case 'poultryWasteManagementLifecycle':
            return "poultryWasteManagement";
        case 'poultryWaterTestLifecycle':
            return "poultryWaterTest";
        case 'poultryWaterUsageLifecycle':
            return "poultryWaterUsage";
        case 'poultryWeightGrowthLifecycle':
            return "poultryWeightGrowth";
        case 'poultrybatchLifecycle':
            return "poultrybatch";
        case 'preventiveMeasuresEventLifecycle':
            return "preventiveMeasuresEvent";
        case 'productBatchValidationLifecycleLifecycle':
            return "productBatchValidationLifecycle";
        case 'psCompostingHarvestEventLifecycle':
            return "psCompostingHarvestEvent";
        case 'psCompostingInputEventLifecycle':
            return "psCompostingInputEvent";
        case 'psEventNonValidationLifecycleLifecycle':
            return "psEventNonValidationLifecycle";
        case 'psImpactEventNonValidationLifecycleLifecycle':
            return "psImpactEventNonValidationLifecycle";
        case 'psOutputProcessingEventLifecycle':
            return "psOutputProcessingEvent";
        case 'psSolarDryerLoadEventLifecycle':
            return "psSolarDryerLoadEvent";
        case 'seedlingsInfoLifecycle':
            return "seedlingsInfo";
        case 'seedsInfoLifecycle':
            return "seedsInfo";
        case 'seedsTreatmentLifecycle':
            return "seedsTreatment";
        case 'sheepBirthLifecycle':
            return "sheepBirth";
        case 'sheepBreedingLifecycle':
            return "sheepBreeding";
        case 'sheepCalvingLifecycle':
            return "sheepCalving";
        case 'sheepFeedLifecycle':
            return "sheepFeed";
        case 'sheepFeedPSLifecycle':
            return "sheepFeedPS";
        case 'sheepMedicationLifecycle':
            return "sheepMedication";
        case 'sheepMedicationPSLifecycle':
            return "sheepMedicationPS";
        case 'sheepNonValidationLifecycleLifecycle':
            return "sheepNonValidationLifecycle";
        case 'sheepPSNonValidationLifecycleLifecycle':
            return "sheepPSNonValidationLifecycle";
        case 'sheepPSValidationLifecycleLifecycle':
            return "sheepPSValidationLifecycle";
        case 'sheepSaleLifecycle':
            return "sheepSale";
        case 'sheepSalePSLifecycle':
            return "sheepSalePS";
        case 'sheepVaccinationLifecycle':
            return "sheepVaccination";
        case 'sheepVaccinationPSLifecycle':
            return "sheepVaccinationPS";
        case 'sheepValidationLifecycleLifecycle':
            return "sheepValidationLifecycle";
        case 'sheepWeaningLifecycle':
            return "sheepWeaning";
        case 'sheepWeightGrowthLifecycle':
            return "sheepWeightGrowth";
        case 'soilInfoLifecycle':
            return "soilInfo";
        case 'solarDryerLoadEventLifecycle':
            return "solarDryerLoadEvent";
        case 'sowingEventLifecycle':
            return "sowingEvent";
        case 'sowingNonValidationLifecycleLifecycle':
            return "sowingNonValidationLifecycle";
        case 'sowingRaisingNurseryLifecycle':
            return "sowingRaisingNursery";
        case 'transactionCertificateValidationLifecycleLifecycle':
            return "transactionCertificateValidationLifecycle";
        case 'validationLifecycleLifecycle':
            return "validationLifecycle";
        case 'waterTestLifecycle':
            return "waterTest";
        case 'weedManagementInterCultureOpsEventLifecycle':
            return "weedManagementInterCultureOpsEvent";
        case 'weedManagementWeedingEventLifecycle':
            return "weedManagementWeedingEvent";
        default: break;
    }
    return "<unknown-start-schema>";
}

function BulkEventEditor(editorProps: any) {
    const {
        open,
        onClose,
        onSubmit,
        Events,
        EventSubTitles,
        workflowNames,
        type,
        title
    } = editorProps;

    const router = useRouter();
    const [selectedMainEvent, setSelectedMainEvent] = useState(0);
    const [selectedSubEvent, setSelectedSubEvent] = useState(0);

    const handleTitleChange = (evt: any) => {
        setSelectedSubEvent(0), setSelectedMainEvent(evt.target.value);
    };

    const wfName = workflowNames[selectedMainEvent][selectedSubEvent];
    const schemaName = getWfStartSchemaName(wfName);

    const handleExcelTemplate = () => {
        onSubmit({ schemaName, wfName });
    };

    const handleSubTitleChange = (evt: any) => setSelectedSubEvent(evt.target.value);

    if (!wfName) {
        return <div> Event is not defined </div>;
    }


    return (
        <Dialog fullWidth={true} open={open} onClose={onClose} maxWidth={'lg'} title={title} dialogContentProps={{
            sx: {
                padding: '2rem !important',
                height: '100vh'

            },
        }}>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: '2rem' }}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor='Event'>Select event category</InputLabel>
                        <Select
                            value={selectedMainEvent}
                            label='Select event category'
                            onChange={handleTitleChange}
                            id='Editor'
                        >
                            {Events.map((EventTitle: string, index: number) => (
                                <MenuItem value={index} key={`eventTitle${index}`}>
                                    {EventTitle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {EventSubTitles[selectedMainEvent][0] !== 'None' && (
                        <FormControl fullWidth>
                            <InputLabel htmlFor='Editor'>Select event</InputLabel>
                            <Select
                                value={selectedSubEvent}
                                label='Select event'
                                onChange={handleSubTitleChange}
                                id='Editor'
                            >
                                {EventSubTitles[selectedMainEvent].map((EventSubTitle: string, index: number) => (
                                    <MenuItem value={index} key={`eventSubTitle${index}`}>
                                        {EventSubTitle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
                {type === 'form' &&
                    <Paper sx={{ padding: 4 }}>
                        <Suspense fallback={<NextProgress delay={10} options={{ showSpinner: true }} />}>
                            <EventEditor
                                onSubmit={onSubmit}
                                wfName={wfName}
                            />
                        </Suspense>
                    </Paper>
                }
                {type === 'excel' &&
                    <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={handleExcelTemplate}
                        type='submit'
                    >
                        {`Submit`}
                    </Button>
                }
            </Stack>
        </Dialog>
    );

}

export default BulkEventEditor

