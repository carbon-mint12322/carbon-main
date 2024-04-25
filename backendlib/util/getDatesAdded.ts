import dayjs, { ManipulateType } from 'dayjs';
import { rearrangeDateDMYToYMD } from '../utils';

export function addDate({
  date,
  toAdd,
  unit,
}: {
  date: string; // DD/MM/YYYY
  toAdd: number;
  unit: ManipulateType;
}): string {
  // returns DD/MM/YYYY
  return dayjs(rearrangeDateDMYToYMD(date)).add(toAdd, unit).format('DD/MM/YYYY');
}
