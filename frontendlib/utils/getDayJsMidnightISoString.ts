import { Dayjs } from 'dayjs';

export function getDayJsMidnightISoString(dayjs: Dayjs) {
  // ISO Sample : 2023-05-24T10:24:46.420Z
  return dayjs.toISOString().split('T')[0] + 'T00:00:00.000Z';
}
