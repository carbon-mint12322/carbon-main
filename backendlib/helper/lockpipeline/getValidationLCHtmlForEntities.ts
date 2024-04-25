import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { getFirstValidationLifeCycleEvent } from './getFirstValidationLifeCycleEvent';

export async function getValidationLCHtmlForEntities(obj: Record<string, any>) {
  if (typeof obj !== 'object') return {};

  const result: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    const eventHistory = await getFirstValidationLifeCycleEvent(obj[key]);
    result[key] = getValidationLifeCycleEventsHtml(eventHistory);
  }

  return result;
}
