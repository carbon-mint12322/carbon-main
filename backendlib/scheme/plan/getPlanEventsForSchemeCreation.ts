import { ControlPoint, CompliancePoint } from '~/backendlib/pop/types';
import { SchemePlanEventT } from '~/backendlib/types';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { getEventParamsForCreation } from './getEventParamsForCreation';

/**
 * return plan events for given controlPoints
 */
export function getPlanEventsForSchemeCreation({
  compliancePoints,
  startDate,
}: {
  compliancePoints: CompliancePoint[];
  startDate: string;
}): SchemePlanEventT[] {
  // 1. getting all plan event as nested array
  // 2. making the nested array to a single array
  // 3. sorting the plan events by start date
  return compliancePoints
    .map((cp) => getEventParamsForCreation({ startDate, cp }))
    .reduce((acc, curr) => acc.concat(...curr), [])
    .sort((a, b) => {
      return (
        new Date(rearrangeDateDMYToYMD(a.range?.start)).valueOf() -
        new Date(rearrangeDateDMYToYMD(b.range?.start)).valueOf()
      );
    });
}
