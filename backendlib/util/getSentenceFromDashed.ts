import { capitalize } from 'lodash';

/** */
export function getSentenceFromDashed(word: `${string}-${string}`) {
  return (word ?? '')
    .split('-')
    .map((r) => capitalize(r))
    .join(' ');
}
