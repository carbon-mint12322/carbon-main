/* eslint-disable no-console */
import { has, get } from 'lodash';
import { shouldDebug } from './shouldDebug';

/** */
export function getVal(data: any, path: string, defaultVal?: any) {
  try {
    if (has(data, path)) {
      return get(data, path);
    }
    throw new Error(`${path} does not exist in data`);
  } catch (e) {
    if (shouldDebug()) console.error(e);
  }

  return defaultVal;
}
