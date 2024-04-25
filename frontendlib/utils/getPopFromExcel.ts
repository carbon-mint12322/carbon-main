import { ControlPoint, CropPopType, Pop, PopDetails, PopFromExcel } from '~/backendlib/pop/types';

export function getPopFromExcel(data: any[]): PopFromExcel {
  return {
    ...getPopDetails(data),
    cropPopType: getCropPopType(data),
    controlPoints: getControlPoints(data),
  };
}

/** */
function getPopDetails(data: any[]): PopDetails {
  return {
    name: findDetailInData(data, 'POP Name')?.trim(),
    description: findDetailInData(data, 'Description')?.trim(),
    recommendedBy: findDetailInData(data, 'Recommended By')?.trim(),
  };
}

/** */
function getCropPopType(data: any[]): CropPopType {
  return {
    name: findDetailInData(data, 'Crop Name')?.trim(),
    variety: findDetailInData(data, 'Variety Name')?.trim(),
    season: findDetailInData(data, 'Season')?.trim(),
    durationType: findDetailInData(data, 'Duration type')?.trim(),
    durationDays: Number(findDetailInData(data, 'Crop duration in days')),
    region: findDetailInData(data, 'Region')?.trim(),
  };
}

/** */
function findDetailInData(data: any[], key: string): string {
  const detail = data.find((item) => item['CarbonMint POP Template'].trim() === key.trim());
  return detail['__EMPTY'];
}

/** */
function getControlPoints(rows: any[]): ControlPoint[] {
  const startIndexForControlPoints = getControlPointsStartingIndex(rows);

  return rows.splice(startIndexForControlPoints).map((row: any): ControlPoint => {
    // Extracting values from Excel columns
    const name = row['__EMPTY']?.trim();
    const activityType = row['__EMPTY_1']?.trim();
    const period = row['__EMPTY_2']?.trim();
    const daysStart = Number(row['__EMPTY_3']);
    const daysEnd = Number(row['__EMPTY_4']);
    const technicalAdvice = (row['__EMPTY_5'] ?? '')?.trim();
    const ccp = row['__EMPTY_6'] === 'Yes';
    const repeated = row['__EMPTY_7'] === 'Yes';
    const frequency = Number(row['__EMPTY_8']);
    const ends = Number(row['__EMPTY_9']);

    // Extracting comma-separated values
    const serviceCatalogIds = (row['__EMPTY_10'] ?? '').split(',').map((id: string) => id.trim());
    const impactParameters = (row['__EMPTY_11'] ?? '').split(',').map((param: string) => param.trim());

    // Extracting inputs (comma-separated values with three parts)
    const inputsString = row['__EMPTY_12'] ?? '';
    const inputs = inputsString.split(',').map((input: string) => {
      const [productCatalogId, unit, quantityPerAcre] = input.split(';').map((part: string) => part.trim());
      return {
        productCatalogId,
        unit,
        quantityPerAcre: Number(quantityPerAcre),
      };
    });

    return {
      name,
      activityType,
      period,
      days: {
        start: daysStart,
        end: daysEnd,
      },
      technicalAdvice,
      ccp,
      repeated,
      frequency,
      ends,
      serviceCatalogIds,
      impactParameters,
      inputs,
    };
  });
}

/** */
function getControlPointsStartingIndex(rows: any[]) {
  return rows.findIndex((row) => row['CarbonMint POP Template'].trim() === 'S.No') + 1;
}

// Sample which against the above data is modeled against, when model changes. Code needs to change
const sample = [
  {
    'CarbonMint POP Template': 'Crop Name ',
    __EMPTY: 'Jowar',
  },
  {
    'CarbonMint POP Template': 'Variety Name ',
    __EMPTY: 'White',
  },
  {
    'CarbonMint POP Template': 'Season',
    __EMPTY: 'Kharif',
  },
  {
    'CarbonMint POP Template': 'Duration type ',
    __EMPTY: 'Short Duration',
  },
  {
    'CarbonMint POP Template': 'Crop duration in days ',
    __EMPTY: 120,
  },
  {
    'CarbonMint POP Template': 'Region',
    __EMPTY: 'Telangana',
  },
  {
    'CarbonMint POP Template': 'Control Points: ',
  },
  {
    'CarbonMint POP Template': 'S.No',
    __EMPTY: 'Event/Activity Name ',
    __EMPTY_1: 'Event Type',
    __EMPTY_2: 'Period Description',
    __EMPTY_3: 'Start Day',
    __EMPTY_4: 'End Day',
    __EMPTY_5: 'Technical Advice',
    __EMPTY_6: 'Repeated',
    __EMPTY_7: 'Frequency (Days)',
    __EMPTY_8: 'Ends (Days)',
  },
  {
    'CarbonMint POP Template': 1,
    __EMPTY: 'Land preparation - Deep summer plouging',
    __EMPTY_1: 'Land preparation',
    __EMPTY_2: '1st week of May to 2nd week of May',
    __EMPTY_3: -30,
    __EMPTY_4: -20,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 2,
    __EMPTY: 'Procurement of seeds',
    __EMPTY_1: 'Planting material procurement',
    __EMPTY_2: '1st week of May to 1st week of June',
    __EMPTY_3: -7,
    __EMPTY_4: -2,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 3,
    __EMPTY: 'Application of manures (FYM)',
    __EMPTY_1: 'Land preparation',
    __EMPTY_2: '2nd week of may to 4th week of May',
    __EMPTY_3: -2,
    __EMPTY_4: -1,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 4,
    __EMPTY: 'Seed treatment  ',
    __EMPTY_1: 'Planting material treatment',
    __EMPTY_2: '1st week of June to 2nd week of July',
    __EMPTY_3: -1,
    __EMPTY_4: -1,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 5,
    __EMPTY: 'Land preparation - Ploughing & harrowing',
    __EMPTY_1: 'Land preparation',
    __EMPTY_2: '1st week of June to 4th week of June',
    __EMPTY_3: -1,
    __EMPTY_4: 0,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 6,
    __EMPTY: 'Sowing ',
    __EMPTY_1: 'Plantation',
    __EMPTY_2: '1st week of June to 2nd week of July',
    __EMPTY_3: 0,
    __EMPTY_4: 0,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 7,
    __EMPTY: 'Application of chemical fertiizer - Basal application (NPK)',
    __EMPTY_1: 'Integrated crop nutrition',
    __EMPTY_2: '1st week of June to 2nd week of July (at the time of sowing',
    __EMPTY_3: 7,
    __EMPTY_4: 15,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 8,
    __EMPTY: 'Application of chemical fertiizer - Top dressing (N)',
    __EMPTY_1: 'Integrated crop nutrition',
    __EMPTY_2: '1st week of July to 2nd week of august',
    __EMPTY_3: 30,
    __EMPTY_4: 60,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 9,
    __EMPTY: 'Inter cultivation - Harrowing',
    __EMPTY_1: 'Intercultural operations',
    __EMPTY_2: '1st Harrowing - 10 days (June to July)',
    __EMPTY_3: 10,
    __EMPTY_4: 10,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 10,
    __EMPTY: 'Inter cultivation - Harrowing',
    __EMPTY_1: 'Intercultural operations',
    __EMPTY_2: '2nd Harrowing - 30 days (August to September)',
    __EMPTY_3: 30,
    __EMPTY_4: 30,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 11,
    __EMPTY: 'Irrigation: Crop critical stages',
    __EMPTY_1: 'Irrigation',
    __EMPTY_2: '1st Irrigation: 20 to 25 days (July to August)',
    __EMPTY_3: 20,
    __EMPTY_4: 25,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 12,
    __EMPTY: 'Irrigation: Crop critical stages',
    __EMPTY_1: 'Irrigation',
    __EMPTY_2: '2nd Irrigation: ear head (September)',
    __EMPTY_3: 60,
    __EMPTY_4: 90,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 13,
    __EMPTY: 'Plant protection measures (Pests) - Shoot fly',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: '1st July to 1st week August',
    __EMPTY_3: 15,
    __EMPTY_4: 60,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 14,
    __EMPTY: 'Plant protection measures (Pests) - Stemborer',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: '1st week August',
    __EMPTY_3: 15,
    __EMPTY_4: 45,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 15,
    __EMPTY: 'Plant protection measures (Pests) - Corn Leaf Allied',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: 'August',
    __EMPTY_3: 15,
    __EMPTY_4: 60,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 16,
    __EMPTY: 'Plant protection measures (Pests) - Ear Head Bug  ',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: 'September',
    __EMPTY_3: 90,
    __EMPTY_4: 120,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 17,
    __EMPTY: 'Plant protection measures (Diseases) - Grain hold',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: '1st week of September to October',
    __EMPTY_3: 45,
    __EMPTY_4: 120,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 18,
    __EMPTY: 'Plant protection measures (Diseases) - Smuts',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: '1st week of September to October',
    __EMPTY_3: 45,
    __EMPTY_4: 120,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 19,
    __EMPTY: 'Plant protection measures (Diseases) - Ergo',
    __EMPTY_1: 'Integrated crop care',
    __EMPTY_2: '1st week of September to October',
    __EMPTY_3: 45,
    __EMPTY_4: 120,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 20,
    __EMPTY: 'Harvesting:',
    __EMPTY_1: 'Harvest',
    __EMPTY_2: '1st week of October to 1st week of November',
    __EMPTY_3: 60,
    __EMPTY_4: 157,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 21,
    __EMPTY: 'Threshing',
    __EMPTY_1: 'Post processing',
    __EMPTY_2: '2nd week to 3rd week of November',
    __EMPTY_3: 164,
    __EMPTY_4: 172,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
  {
    'CarbonMint POP Template': 22,
    __EMPTY: 'Storage',
    __EMPTY_1: 'Storage',
    __EMPTY_2: '4th week of November',
    __EMPTY_3: 171,
    __EMPTY_4: 178,
    __EMPTY_6: 'No',
    __EMPTY_7: 0,
    __EMPTY_8: 0,
  },
];
