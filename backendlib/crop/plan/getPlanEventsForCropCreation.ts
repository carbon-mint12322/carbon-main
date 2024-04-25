import { ControlPoint } from '~/backendlib/pop/types';
import { PlanEventT } from '~/backendlib/types';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import { getEventParamsForCreation } from './getEventParamsForCreation';

/**
 * return plan events for given controlPoints
 */
export function getPlanEventsForCropCreation({
  controlPoints,
  startDate,
}: {
  controlPoints: ControlPoint[];
  startDate: string;
}): PlanEventT[] {
  // 1. getting all plan event as nested array
  // 2. making the nested array to a single array
  // 3. sorting the plan events by start date
  return controlPoints
    .map((cp) => getEventParamsForCreation({ startDate, cp }))
    .reduce((acc, curr) => acc.concat(...curr), [])
    .sort((a, b) => {
      return (
        new Date(rearrangeDateDMYToYMD(a.range?.start)).valueOf() -
        new Date(rearrangeDateDMYToYMD(b.range?.start)).valueOf()
      );
    });
}
