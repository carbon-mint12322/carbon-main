/** */
// DAYJS not working properly on DD/MM/YYYY reading, so using this custom function
export function rearrangeDateDMYToYMD(date: string) {
  return date.split('/').reverse().join('-');
}

export function parseISODateStringToDateString(date: string): string {
  const originalDate: Date = new Date(date);
  originalDate.setUTCHours(0, 0, 0, 0);

  originalDate.setUTCDate(originalDate.getUTCDate() - 1);

  const formattedDate: string = originalDate.toISOString().split('T')[0];

  return formattedDate;
}
