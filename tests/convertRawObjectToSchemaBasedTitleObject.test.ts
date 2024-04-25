import { expect } from 'chai';
import { convertRawObjectToSchemaBasedTitleObject } from '~/backendlib/util/convertRawObjectToSchemaBasedTitleObject';
import IrrigationJsonSchema from '~/gen/jsonschemas/irrigationEvent.json';
import HarvestingEventJsonSchema from '~/gen/jsonschemas/harvestingEvent.json';

describe('convertRawObjectToSchemaBasedTitleObject', () => {
  it('Irrigation Event Check', () => {
    const rawData = {
      sourceOfIrrigation: 'Rainfall',
      criticalCropGrowthStage: 'Panicle initiation',
      durationAndExpenses: {
        photoEvidenceBeforeAfter: ['url', 'rul', 'url'],
        documentEvidenceInvoice: [],
        startDate: '2023-02-20',
        endDate: '2023-02-23',
        totalExpenditure: 1000,
      },
      otherIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      borewellIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      openWellIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      canalIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      riversIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      pondIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      municipalityIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      lakeIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      reservoirIrrigationData: {
        methodOfIrrigation: 'Flooding',
      },
      evidences: [],
      name: 'Irrigation Event',
    };

    const EXPECTED_RESULT = {
      name: 'Irrigation Event',
      'Source of irrigation': 'Rainfall',
      'Irrigated in critical crop growth stages': 'Panicle initiation',
      'Duration and expenses': {
        'Start date': '2023-02-20',
        'End date': '2023-02-23',
        'Total expenditure': 1000,
        'Photo evidence (before & after)': ['url', 'rul', 'url'],
        'Document evidence (invoice / others)': [],
      },
      otherIrrigationData: { methodOfIrrigation: 'Flooding' },
      borewellIrrigationData: { methodOfIrrigation: 'Flooding' },
      openWellIrrigationData: { methodOfIrrigation: 'Flooding' },
      canalIrrigationData: { methodOfIrrigation: 'Flooding' },
      riversIrrigationData: { methodOfIrrigation: 'Flooding' },
      pondIrrigationData: { methodOfIrrigation: 'Flooding' },
      municipalityIrrigationData: { methodOfIrrigation: 'Flooding' },
      lakeIrrigationData: { methodOfIrrigation: 'Flooding' },
      reservoirIrrigationData: { methodOfIrrigation: 'Flooding' },
    };

    const ACTUAL_RESULT = convertRawObjectToSchemaBasedTitleObject(
      rawData,
      IrrigationJsonSchema as any,
    );

    expect(ACTUAL_RESULT).deep.equals(EXPECTED_RESULT);
  });

  it('Harvesting Event Check', () => {
    const rawData = {
      harvestProduce: 'Primary produce',
      harvestingIndex: 'Physical',
      harvestingDoneBy: 'Manual',
      containersUsedCondition: 'Fresh',
      containersUsedState: 'Cleaned',
      durationAndExpenses: {
        photoEvidenceBeforeAfter: [],
        documentEvidenceInvoice: [],
        startDate: '2023-04-27',
        endDate: '2023-05-01',
        totalExpenditure: 1000,
      },
      primaryProduce: 'Grain',
      manualImplementsUsed: 'By hands',
      secondaryProduce: 'Grain',
      machineryImplementsUsed: 'Reapers',
      bullockImplementsUsed: 'Cultivators',
      harvestQuantity: 9,
      evidences: [],
      name: 'Harvest Event',
    };

    const EXPECTED_RESULT = {
      name: 'Harvest Event',
      'Harvest produce': 'Primary produce',
      'Harvesting index (or) indices': 'Physical',
      'Harvesting done by': 'Manual',
      'Containers used condition': 'Fresh',
      'Containers used state': 'Cleaned',
      'Quantity of harvest (Tonnes)': 9,
      'Duration and expenses': {
        'Start date': '2023-04-27',
        'End date': '2023-05-01',
        'Total expenditure': 1000,
        'Photo evidence (before & after)': [],
        'Document evidence (invoice / others)': [],
      },
      primaryProduce: 'Grain',
      secondaryProduce: 'Grain',
      'Implements used': 'Cultivators',
    };

    const ACTUAL_RESULT = convertRawObjectToSchemaBasedTitleObject(
      rawData,
      HarvestingEventJsonSchema as any,
    );

    expect(ACTUAL_RESULT).deep.equals(EXPECTED_RESULT);
  });
});
