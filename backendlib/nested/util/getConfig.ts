import { ModelParams } from '../types';
import Config from '../config';

export function getConfigForChildResource({
  childResourceParamName,
}: {
  childResourceParamName: string;
}): Omit<ModelParams, 'childResourceParamName' | 'schema' | 'model'> {
  //
  const config = Config[childResourceParamName];

  //
  if (!config) throw new Error('CONFIG_NOT_FOUND');

  return config;
}
