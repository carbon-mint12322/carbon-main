import dayjs from 'dayjs';

/** */
export function withEventDate<T = object>(event: T): T & { eventDate: string } {
  return { ...event, eventDate: getEventDate(event) };
}

/** */
function getEventDate(event: any) {
  return event?.details?.durationAndExpenses?.startDate
    ? dayjs(event?.details?.durationAndExpenses?.startDate).format('DD MMM YYYY')
    : dayjs(event?.details?.startDate || event?.details?.dateOfPurchase).format('DD MMM YYYY');
}
