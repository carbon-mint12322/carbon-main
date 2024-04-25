import { IJsonSchema } from '../types';

export function moveThenElseProperties(jsonSchema: IJsonSchema): IJsonSchema {
  if (!jsonSchema || typeof jsonSchema !== 'object') {
    return jsonSchema;
  }

  if (jsonSchema.properties && (jsonSchema.then || jsonSchema.else)) {
    const properties: Record<string, any> = { ...jsonSchema.properties };
    const thenProperties: Record<string, any> = jsonSchema.then?.properties || {};
    const elseProperties: Record<string, any> = jsonSchema.else?.properties || {};

    jsonSchema.properties = {
      ...properties,
      ...thenProperties,
      ...elseProperties,
    };
    delete jsonSchema.then;
    delete jsonSchema.else;
  }

  for (const key in jsonSchema) {
    jsonSchema[key as keyof typeof jsonSchema] = moveThenElseProperties(
      jsonSchema[key as keyof typeof jsonSchema],
    );
  }

  return jsonSchema;
}
