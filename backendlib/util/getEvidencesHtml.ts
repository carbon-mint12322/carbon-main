import { get } from 'lodash';
import { getFileModalPopupHtml } from './getFileModalPopupHtml';

/** */
export function getEvidencesHtml(details: Record<string, any>): string {
  return getFileModalPopupHtml(get(details, 'evidences', []));
}
