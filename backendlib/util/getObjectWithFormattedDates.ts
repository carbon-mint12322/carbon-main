import { get, set } from 'lodash';
import { stringDateFormatter } from '~/utils/dateFormatter';

type T = Record<string, any>;

/** */
export function getObjectWithFormattedDates(
  event: T,
  keysWhichRequireDateFormatting: Array<keyof T>,
) {
  //
  if (!(event && typeof event === 'object')) return event;

  let formattedObj: Record<string, any> = { ...event };

  //
  keysWhichRequireDateFormatting.map((key) => {
    //
    const val = get(event, key, null);

    if (!(val && typeof val === 'string')) return {};

    set(formattedObj, key, stringDateFormatter(val));
  });

  return formattedObj;
}
