import { capitalize } from 'lodash';

/** */
export function getCapitalizeDashedWord(word: `${string}-${string}`) {
  const [first, ...rest] = word.split('-');

  const formattedRest = (rest ?? []).map((r) => capitalize(r)).join('');

  return `${first}${formattedRest}`;
}
