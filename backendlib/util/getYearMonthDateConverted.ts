// NOTE: dayjs was throwing error for DD-MM-YYYY even when proper format was given, so converting here
export function getYearMonthDateConverted(date: string): string {
  const split = date.split('/');

  return split[2] + '/' + split[1] + '/' + split[0];
}
