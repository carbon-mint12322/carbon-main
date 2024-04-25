import { ControlPoint, PoultryPopType, PoultryPopDetails, PoultryPopFromExcel } from '~/backendlib/poultrypop/types';

export function getPoultryPopFromExcel(data: any[]): PoultryPopFromExcel {
  return {
    ...getPoultryPopDetails(data),
    poultryPopType: getPoultryPopType(data),
    controlPoints: getControlPoints(data),
  };
}

/** */
function getPoultryPopDetails(data: any[]): PoultryPopDetails {
  return {
    name: findDetailInData(data, 'Poultry POP Name').trim(),
    description: findDetailInData(data, 'Description').trim(),
    recommendedBy: findDetailInData(data, 'Recommended By').trim(),
  };
}

/** */
function getPoultryPopType(data: any[]): PoultryPopType {
    return {
    poultryType: findDetailInData(data, 'Poultry Type').trim(),
    variety: findDetailInData(data, 'Poultry variety').trim(),
    region: findDetailInData(data, 'Region').trim(),
    durationDays: Number(findDetailInData(data, 'Poultry duration (days)')),
  };
}

/** */
function findDetailInData(data: any[], key: string): string {
  const detail = data.find((item) => item['CarbonMint Poultry POP Template'].trim() === key.trim());
  return detail['__EMPTY'];
}

/** */
function getControlPoints(rows: any[]): ControlPoint[] {
  const startIndexForControlPoints = getControlPointsStartingIndex(rows);

  return rows.splice(startIndexForControlPoints).map((row: any): ControlPoint => {
    return {
      name: row['__EMPTY'].trim(),
      activityType: row['__EMPTY_1'].trim(),
      period: row['__EMPTY_2'].trim(),
      days: {
        start: Number(row['__EMPTY_3']),
        end: Number(row['__EMPTY_4']),
      },
      technicalAdvice: (row['__EMPTY_5'] ?? '').trim(),
      ccp: row['__EMPTY_6'] === 'Yes' ? true : false,
      repeated: row['__EMPTY_7'] === 'Yes' ? true : false,
      frequency: Number(row['__EMPTY_8']),
      ends: Number(row['__EMPTY_9']),
    };
  });
}

/** */
function getControlPointsStartingIndex(rows: any[]) {
  return rows.findIndex((row) => row['CarbonMint Poultry POP Template'].trim() === 'S.No') + 1;
}
