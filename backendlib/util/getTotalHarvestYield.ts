import { get } from 'lodash';
import { isValidEvent } from './isValidEvent';
import { isHarvestEvent } from './isHarvestEvent';

/** */
export function getTotalHarvestYield(events: unknown[]) {
  //
  if (!(events && Array.isArray(events))) return;

  return events
    .filter((event) => isValidEvent(event as any) && isHarvestEvent(event as object))
    .map((event) => get(event, 'details.harvestQuantity', 0))
    .reduce((curr, acc) => curr + acc, 0);
}
