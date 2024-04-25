import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { PlanEventInputParamsT, PlanEventT } from '~/backendlib/types';
import { getDateIntervalsOfEvent } from './getDateIntervalsOfEvent';

/** */
export function getPlanEventsToCreate(rawPayload: PlanEventInputParamsT): PlanEventT[] {
  // deconstructing object to only allow neccessary params
  const {
    name,
    period,
    activityType,
    range: { start: rawStart, end: rawEnd },
    frequency,
    ends,
    repeated,
    ccp,
    technicalAdvice,
    eventStatus,
  } = { frequency: 0, ends: 0, repeated: false, ...rawPayload };

  // get params for
  const getEventParams = (): Omit<PlanEventT, 'range'> => ({
    name,
    period,
    activityType,
    ccp,
    _id: new ObjectId().toString(),
    technicalAdvice: technicalAdvice ?? '',
    eventStatus: eventStatus ?? 'Pending', // Pending is default
  });

  const start = dayjs(rawStart).format('DD/MM/YYYY');
  const end = dayjs(rawEnd).format('DD/MM/YYYY');

  // if not repeat returning the params as a single event
  if (!repeated) return [{ ...getEventParams(), range: { start, end } }];

  // else if repeated then
  // 1. getting intervals based on frequency and ends
  // 2. constructing and returning the object with calculated range
  return getDateIntervalsOfEvent({
    start,
    end,
    frequency,
    ends,
  }).map((range) => ({
    ...getEventParams(),
    range,
  }));
}
