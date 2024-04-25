import { get, has } from 'lodash';

/** */
export function getEvidences(
  modalJson: Array<Record<string, any>>,
  details: Record<string, any>,
): Record<string, any> | null {
  // If details has evidences
  if (has(details, 'evidences') && Array.isArray(details.evidences) && details.evidences.length) {
    // get if evidences section if already exist
    const evidenceFromModalJson = modalJson.find(
      (item: Record<string, any>) => item.name === 'Evidences',
    );

    if (!evidenceFromModalJson) {
      return {
        name: 'Evidences',
        UIRenderValues: get(details, 'evidences'),
      };
    }
  }

  return null;
}
