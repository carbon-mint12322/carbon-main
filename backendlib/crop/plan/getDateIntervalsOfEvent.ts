import { addDate } from '~/backendlib/util/getDatesAdded';

type InputParams = {
  start: string; // DD/MM/YYYY
  end: string; // DD/MM/YYYY
  frequency: number;
  ends: number;
};

type OutputParams = {
  start: string; // DD/MM/YYYY
  end: string; // DD/MM/YYYY
};

export function getDateIntervalsOfEvent(p: InputParams): OutputParams[] {
  // destrcuturing params
  const { start, end, ends, frequency } = p;

  // find total occurrence of the event
  const totalOccurrence = Math.floor(Number(Number(ends) / Number(frequency)));

  // if not total occurence greater than zero or if is inifinty (when 1 gets divided by zero)
  // then return empty arry as result
  if (!(totalOccurrence > 0) || totalOccurrence === Infinity) return [];

  // get start and end dates in future as many times as occurrences happen
  const intervals: OutputParams[] = [];

  for (let i = 0; i < totalOccurrence; i++) {
    // repetition based increment of months
    const toAdd = i * frequency;

    intervals.push({
      start: addDate({ date: start, toAdd, unit: 'days' }),
      end: addDate({ date: end, toAdd, unit: 'days' }),
    });
  }

  return intervals;
}
