export function getUriForPlanEventNotification(orgSlug: string) {
  const uri = `api/farmbook/${orgSlug}/plan/notify`;

  if (!(typeof uri === 'string' && uri.length)) throw new Error('Uri not valid');

  return uri;
}
