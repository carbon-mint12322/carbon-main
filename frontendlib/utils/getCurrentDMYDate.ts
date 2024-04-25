import dayjs from 'dayjs';

export function getCurrentDMYDate() {
  return dayjs(new Date().toISOString()).format('DD/MM/YYYY');
}


export function getCurrentMYDate() {
  return dayjs(new Date().toISOString()).format('MMM - YYYY');
}
