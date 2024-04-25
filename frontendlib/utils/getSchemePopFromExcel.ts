import { CompliancePoint, SchemePop, SchemePopDetails, SchemePopFromExcel } from '~/backendlib/pop/types';


// Function to parse Excel data
// Function to parse Excel data
export function getSchemePopFromExcel(data: any[]): SchemePopFromExcel {
  return {
    certificationAuthority: findDetailInData(data, 'Certification Authority'),
    duration: findDetailInData(data, 'Duration (Months)'),
    description: findDetailInData(data, 'Description'),
    name: findDetailInData(data, 'Scheme POP Name'),
    responsibleParty: findDetailInData(data, 'Responsible Party'),
    scope: findDetailInData(data, 'Scope'),
    compliancePoints: getCompliancePoints(data),
  };
}

function findDetailInData(data: any[], key: string): string {
  const detail = data.find((item) => item['CarbonMint Scheme POP Template'] === key);
  const result = detail && '__EMPTY' in detail ? String(detail['__EMPTY']).trim() : '';
  return result;
}

function getCompliancePoints(rows: any[]): CompliancePoint[] {
  const startIndexForCompliancePoints = getCompliancePointsStartingIndex(rows);

  const result = rows.slice(startIndexForCompliancePoints).map((row: any): CompliancePoint => {
    const isValidNumber = (value: any) => !isNaN(Number(value)) && value !== '';
    const parseBoolean = (value: any) => String(value).toLowerCase() === 'yes';


    return {
      name: String(row.__EMPTY?.trim() || ''),
      description: String(row.__EMPTY_1?.trim() || ''),
      severity: String(row.__EMPTY_2?.trim() || ''),
      score: isValidNumber(row.__EMPTY_3) ? Number(row.__EMPTY_3) : 0,
      days: {
        start: isValidNumber(row.__EMPTY_4) ? Number(row.__EMPTY_4) : 0,
        end: isValidNumber(row.__EMPTY_5) ? Number(row.__EMPTY_5) : 0,
      },
      repeated: parseBoolean(row.__EMPTY_6),
      frequency: isValidNumber(row.__EMPTY_7) ? Number(row.__EMPTY_7) : 0,
      ends: isValidNumber(row.__EMPTY_8) ? Number(row.__EMPTY_8) : 0,
    };
  });

  return result;
}

function getCompliancePointsStartingIndex(rows: any[]) {
  // Search for the row that has "S.No" in any column
  const index = rows.findIndex(row => Object.values(row).some(value => value === 'S.No'));

  // If found, return its index + 1, otherwise return 0
  return index !== -1 ? index + 1 : 0;
}
