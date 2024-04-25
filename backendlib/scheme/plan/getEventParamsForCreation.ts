import { CompliancePoint } from '~/backendlib/pop/types';
import { SchemePlanEventT } from '~/backendlib/types';
import { getAllDateRangeForEvent } from './getAllDateRangeForEvent';
import { DayRange } from '~/backendlib/crop/plan/types';
import { ObjectId } from 'mongodb';
import { has } from 'lodash';

/*
 * get all plan events for the specified date ranges
 */
export function getEventParamsForCreation({
  startDate,
  cp,
}: {
  startDate: string;
  cp: CompliancePoint;
}): SchemePlanEventT[] {
  const { name, description, severity, score } = cp;

  // setting ccp default

  return getAllDateRangeForEvent({ startDate, cp }).map((range: DayRange) => {
    return {
      description,
      name,
      severity,
      score,
      _id: new ObjectId().toString(),
      range,
      eventStatus: 'Pending',
    };
  });
}
