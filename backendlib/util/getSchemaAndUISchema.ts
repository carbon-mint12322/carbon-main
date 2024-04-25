import { IJsonSchema } from '../types';

/** */
export function getSchemaAndUISchema(eventName: string): {
  schema: IJsonSchema;
  uiSchema: Record<string, any>;
} {
  const schema = require(`~/gen/jsonschemas/${eventName}.json`);

  let uiSchema = {};

  try {
    //
    const genUiSchema = require(`~/gen/ui-schemas/${eventName}-ui-schema.json`);
    //
    if (genUiSchema) uiSchema = genUiSchema;
  } catch (e) {
    //
  }

  return { schema, uiSchema };
}
