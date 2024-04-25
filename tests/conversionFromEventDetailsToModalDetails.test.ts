import { expect } from 'chai';
import { conversionFromEventDetailsToModalDetails } from '~/backendlib/util/conversionFromEventDetailsToModalDetails';

describe('conversionFromEventDetailsToModalDetails', () => {
  it('Check if conversion is correct for event detail', async () => {
    //
    const SOURCE = {
      sourceOfIrrigation: 'Rainfall',
      criticalCropGrowthStage: 'Panicle initiation',
      durationAndExpenses: {
        photoEvidenceBeforeAfter: [],
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
      randomName: [
        { lat: 37.772, lng: -122.214 },
        { lat: 31.772, lng: -112.214 },
        { lat: 32.772, lng: -112.214 },
      ],
      name: 'Irrigation Event',
    };

    //
    const EXPECTED_RESULT = [
      {
        sourceOfIrrigation: 'Rainfall',
        criticalCropGrowthStage: 'Panicle initiation',
        name: 'Irrigation Event',
        UIRenderType: 'root',
      },
      {
        name: 'durationAndExpenses',
        photoEvidenceBeforeAfter: [],
        documentEvidenceInvoice: [],
        startDate: '2023-02-20',
        endDate: '2023-02-23',
        totalExpenditure: 1000,
      },
      { name: 'otherIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'borewellIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'openWellIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'canalIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'riversIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'pondIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'municipalityIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'lakeIrrigationData', methodOfIrrigation: 'Flooding' },
      { name: 'reservoirIrrigationData', methodOfIrrigation: 'Flooding' },
      {
        name: 'evidences',
        UIRenderValues: [],
      },
      {
        name: 'map',
        nestedCoordinates: [
          [
            { lat: 37.772, lng: -122.214 },
            { lat: 31.772, lng: -112.214 },
            { lat: 32.772, lng: -112.214 },
          ],
        ],
        markers: [
          { lat: 37.772, lng: -122.214 },
          { lat: 31.772, lng: -112.214 },
          { lat: 32.772, lng: -112.214 },
        ],
        UIRenderType: 'map',
      },
    ];

    //
    const result = conversionFromEventDetailsToModalDetails(SOURCE);

    expect(result).deep.equals(EXPECTED_RESULT);
  });
});
