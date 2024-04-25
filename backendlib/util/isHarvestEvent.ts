import { get } from 'lodash';

/** */
const HARVEST_EVENTS = ['harvestingEvent', 'aquacropHarvest', 'poultryHarvest'];

export function isHarvestEvent(event: object) {
  //
  if (!(event && typeof event === 'object')) return false;

  //
  return HARVEST_EVENTS.includes(get(event, 'name', ''));
}
