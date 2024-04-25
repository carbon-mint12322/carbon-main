import { ControlPoint } from '~/backendlib/pop/types';
import { PlanEventT } from '~/backendlib/types';
import { getAllDateRangeForEvent } from './getAllDateRangeForEvent';
import { DayRange } from './types';
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
  cp: ControlPoint;
}): PlanEventT[] {
  const { name, activityType, period, technicalAdvice } = cp;

  // setting ccp default
  const ccp = has(cp, 'ccp') && typeof cp.ccp === 'boolean' ? cp.ccp : false;

  return getAllDateRangeForEvent({ startDate, cp }).map((range: DayRange) => {
    return {
      activityType,
      name,
      period,
      _id: new ObjectId().toString(),
      range,
      ccp,
      technicalAdvice: technicalAdvice ?? '',
      eventStatus: 'Pending',
    };
  });
}
