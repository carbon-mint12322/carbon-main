import { IJsonSchema } from '../types';
import { assignUIRenderValues } from './assignUIRenderValuesToJsonSchemFromObject';
import { convertObjectToTitleUIRenderValue } from './convertObjectToTitleAndUIRenderValueKVPair';
import { movePropertiesToRootLevel } from './movePropertiesToRootLevel';
import { moveThenElseProperties } from './moveThenElseProperties';
import { resolveJsonSchema } from './resolveJsonSchema';

export function convertRawObjectToSchemaBasedTitleObject(
  obj: any,
  schema: IJsonSchema,
): Record<string, any> {
  //
  const resolvedJsonSchema = resolveJsonSchema(schema);
  //
  const rootLevelResolvedJsonSchema = movePropertiesToRootLevel(resolvedJsonSchema);
  //
  const conditionalsResolvedJsonSchema = moveThenElseProperties(rootLevelResolvedJsonSchema);
  //
  const jsonSchemaWithValues = assignUIRenderValues(obj, conditionalsResolvedJsonSchema);
  //
  return {
    name: schema.title,
    ...convertObjectToTitleUIRenderValue(jsonSchemaWithValues.properties),
  };
}
