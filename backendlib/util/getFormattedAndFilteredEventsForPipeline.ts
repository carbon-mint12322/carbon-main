import { Event } from '../types';
import dayjs from 'dayjs';
import { getDurationBetweenDatesYYYYMMDD } from '~/frontendlib/utils/getDurationBetweenDates';
import { isValidEvent } from './isValidEvent';
import { isHarvestEvent } from './isHarvestEvent';

/** */
export function getFormattedAndFilteredEventsForPipeline(currentEvent: any, events: any): Event[] {
  //
  const allEvents = events
    .filter(isValidEvent)
    .sort(sortFunction)
    ?.map((event: any, index: number) => mapFunction(currentEvent, event, index));

  //
  return isEventAfterCurrentEvent(allEvents);
}

/** */
function sortFunction(a: any, b: any) {
  return (
    +new Date(
      b.details?.durationAndExpenses?.startDate ||
      b.details?.startDate ||
      b.details?.dateOfPurchase ||
      b.createdAt,
    ) -
    +new Date(
      a.details?.durationAndExpenses?.startDate ||
      a.details?.startDate ||
      a.details?.dateOfPurchase ||
      a.createdAt,
    )
  );
}

/** */
function mapFunction(currentEvent: any, event: any, index: number) {
  return {
    _id: event._id,
    name: event?.details?.name,
    createdAt: dayjs(event?.createdAt).format('DD MMM YYYY'),
    eventDate: event?.details?.durationAndExpenses?.startDate
      ? dayjs(event?.details?.durationAndExpenses?.startDate).format('DD MMM YYYY')
      : dayjs(event?.details?.startDate || event.details?.dateOfPurchase || event.details?.dateOfWeighing).format('DD MMM YYYY'),
    days: event?.details?.durationAndExpenses
      ? getDurationBetweenDatesYYYYMMDD(
        event?.details?.durationAndExpenses?.startDate,
        event?.details?.durationAndExpenses?.endDate,
      ) === 0
        ? 1
        : getDurationBetweenDatesYYYYMMDD(
          event?.details?.durationAndExpenses?.startDate,
          event?.details?.durationAndExpenses?.endDate,
        )
      : event?.details?.startDate
        ? getDurationBetweenDatesYYYYMMDD(event?.details?.startDate, event?.details?.endDate) === 0
          ? 1
          : getDurationBetweenDatesYYYYMMDD(event?.details?.startDate, event?.details?.endDate)
        : 1,
    description: event?.details?.otherRemarks,
    isFirst: index === 0,
    notFirst: index !== 0,
    schemaName: event.name,
    fullDetails: event?.details ?? {},
    isCurrentEvent: event._id.toString() === currentEvent._id.toString(),
    isHarvestingEvent: isHarvestEvent(event),
  };
}

/** */
function isEventAfterCurrentEvent(events: Event[]): Event[] {
  //
  const currentEvent = events.find((e) => e.isCurrentEvent);

  //
  if (!currentEvent) return [];

  //
  const isBeforeEvent = (event: Event) =>
    event?.eventDate &&
    currentEvent?.eventDate &&
    dayjs(event.eventDate).isBefore(currentEvent.eventDate);

  return [currentEvent, ...events.filter(isBeforeEvent)];
}
