export function getNumberOfDaysBeforePlanEventForNotification(): number {
  return parseInt(process.env.NOTIFY_USER_BEFORE_DAYS_FOR_PLAN_EVENT || '3') * -1;
}
