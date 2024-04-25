import dayjs from 'dayjs';
import moment from 'moment/moment';

export function stringDateFormatter(date: String) {
  if (!date) {
    return 'NA';
  }
  // if date has "." then format it to "DD MMM YYYY"
  if (dayjs(`${date}`, 'DD.MM.YYYY', true).isValid()) {
    return dayjs(`${date}`, 'DD.MM.YYYY').format('DD MMM YYYY');
  }
  // if date has "-" then format it to "DD MMM YYYY"
  if (dayjs(`${date}`, 'DD-MM-YYYY', true).isValid()) {
    return dayjs(`${date}`, 'DD-MM-YYYY').format('DD MMM YYYY');
  }

  if (dayjs(`${date}`, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(`${date}`, 'YYYY-MM-DD').format('DD MMM YYYY');
  }

  if (moment(`${date}`, moment.ISO_8601, true).isValid()) {
    return moment(`${date}`, moment.ISO_8601).format('DD MMM YYYY hh:mm a');
  }

  if (moment(`${date}`, 'DD/MM/YYYY hh:mm a', true).isValid()) {
    return moment(`${date}`, 'DD/MM/YYYY hh:mm a').format('DD MMM YYYY');
  }

  if (moment(`${date}`, 'DD/MM/YYYY hh:mm:ss', true).isValid()) {
    return moment(`${date}`, 'DD/MM/YYYY hh:mm:ss').format('DD MMM YYYY');
  }

  // if date has "/" then format it to "DD MMM YYYY"
  return dayjs(`${date}`, 'DD/MM/YYYY', true).format('DD MMM YYYY');
}

export function dateFormatter(day: String, month: String, year: String) {
  return dayjs(`${day}-${month}-${year}`).format('DD MMMM YYYY');
}

export function isoToLocal(date: string) {
  const dateFormattingOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  if (!date) {
    return new Date().toLocaleString('en-IN', dateFormattingOptions);
  }
  return new Date(date).toLocaleString('en-IN', dateFormattingOptions);
}

export default stringDateFormatter;
