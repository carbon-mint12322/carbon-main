import { CompliancePoint } from '~/backendlib/pop/types';
import { DayRange } from '~/backendlib/crop/plan//types';
import dayjs from 'dayjs';
import { getDateIntervalsOfEvent } from '~/backendlib/crop/plan/getDateIntervalsOfEvent';

/**
 * get all date ranges (if repeated event, then the same event should occur in the frequency till the plan ends)
 */
export function getAllDateRangeForEvent({
  startDate,
  cp,
}: {
  startDate: string;
  cp: CompliancePoint;
}): DayRange[] {
  const {
    days,
    repeated,
    frequency,
    ends,
  } = {
    repeated: false,
    frequency: 0,
    ends: 0,
    ...cp,
  };
  const start = days?.start || 0
  const end = days?.end || 0
  // first date range based on the original pop item
  const date: DayRange = {
    start: dayjs(startDate, 'YYYY-MM-DD').add(start, 'days').format('DD/MM/YYYY'),
    end: dayjs(startDate, 'YYYY-MM-DD').add(end, 'days').format('DD/MM/YYYY'),
  };

  if (!repeated) return [date];

  // if repeated is selected then get the date range based on frequency and ends In
  return getDateIntervalsOfEvent({ frequency, ends, ...date });
}
