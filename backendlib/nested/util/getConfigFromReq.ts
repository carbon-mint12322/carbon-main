import { NextApiRequest } from 'next';
import { ModelParams } from '../types';
import { getConfigForChildResource } from './getConfig';
import { getCapitalizeDashedWord } from '~/backendlib/util/getCapitalizedDashed';
import { getModel } from '~/backendlib/db/adapter';

export default async function getConfigFromReq(req: NextApiRequest): Promise<ModelParams> {
  //
  const { childResourceParamName: rawCrpm, modelName } = req.query as any;

  const childResourceParamName = getCapitalizeDashedWord(rawCrpm);

  const schema = `/farmbook/${modelName}`
  const model = getModel(schema)

  return {
    ...getConfigForChildResource({ childResourceParamName }),
    childResourceParamName,
    schema,
    model
  };
}
