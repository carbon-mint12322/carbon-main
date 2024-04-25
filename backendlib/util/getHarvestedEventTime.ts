import { addOrdinalSuffix } from '~/utils/addOrdinalSuffix';
import { Event } from '../types';
import moment from 'moment';
import { withEventDate } from './withEventDate';

/** */
export function getHarvestedEventTime(currentEvent: object, events: Event[]): string {
  //
  const onlyGetBeforeEvents = (event: { eventDate: string }) =>
    isBeforeEvent(withEventDate(currentEvent), event);

  //
  const isHarvestFlaggedEvent = (event: Event) => event.isHarvestingEvent;

  //
  const times = events
    // filtering only the harvest events
    .filter(isHarvestFlaggedEvent)
    // Only getting harvest event before current event
    .filter(onlyGetBeforeEvents).length;

  // Adding one because current event would not be counted
  return addOrdinalSuffix(times + 1);
}

//
function isBeforeEvent(currentEvent: { eventDate: string }, event: { eventDate: string }) {
  return (
    event?.eventDate &&
    currentEvent?.eventDate &&
    moment(event.eventDate).isBefore(currentEvent.eventDate)
  );
}
