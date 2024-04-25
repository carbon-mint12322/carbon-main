import dayjs from 'dayjs';

/**
 *
 * Dates should be in DD/MM/YYYY format
 */
export function getDurationBetweenDates(date1: string, date2: string): number {
  if (!date1?.length || !date2?.length) return 0;

  const [startDay, startMonth, startYear] = date1.split('/') || [];
  const [endDay, endMonth, endYear] = date2.split('/') || [];

  const startDate = dayjs(`${startYear}-${startMonth}-${startDay}`);
  const endDate = dayjs(`${endYear}-${endMonth}-${endDay}`);

  return (endDate as any).from(startDate, true);
}

/**
 *
 * Dates should be in YYYY-MM-DD format
 */
export function getDurationBetweenDatesYYYYMMDD(date1: string, date2: string): number {
  try {
    if (!date1?.length || !date2?.length) return 0;

    const startDate = dayjs(date1);
    const endDate = dayjs(date2);

    const duration = endDate.diff(startDate, 'day');

    return !Number.isNaN(duration) ? duration : 0;
  } catch (e) {
    console.error(e);
  }

  return 0;
}
