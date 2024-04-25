import { IJsonSchema } from '../types';

export function movePropertiesToRootLevel(schema: IJsonSchema): IJsonSchema {
  if (!schema.allOf) {
    return schema;
  }

  const allProperties: Record<string, any> = {};
  const thenProperties: Record<string, any> = {};
  const elseProperties: Record<string, any> = {};

  schema.allOf.forEach((item) => {
    if (item.then && item.then.properties) {
      Object.assign(thenProperties, item.then.properties);
      delete item.then;
    }

    if (item.else && item.else.properties) {
      Object.assign(elseProperties, item.else.properties);
      delete item.else;
    }
  });

  Object.assign(allProperties, thenProperties, elseProperties);
  schema.properties = { ...schema.properties, ...allProperties };
  delete schema.allOf;

  return schema;
}
