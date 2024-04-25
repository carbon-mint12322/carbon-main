import { IJsonSchema } from '../types';

export function assignUIRenderValues(object: any, schema: IJsonSchema): any {
  if (typeof object !== 'object' || typeof schema !== 'object') {
    throw new Error('Invalid inputs. Expected object and JSON schema.');
  }

  try {
    // Iterate over the properties in the object
    for (const prop in object) {
      // eslint-disable-next-line no-prototype-builtins
      if (object.hasOwnProperty(prop)) {
        // Check if the property exists in the JSON schema
        if (schema.properties && schema.properties[prop]) {
          // Assign the property value to the JSON schema with UIRenderValue
          schema.properties[prop].UIRenderValue = object[prop];
        }

        // Check if the property has nested properties
        if (
          object[prop] &&
          typeof object[prop] === 'object' &&
          schema.properties[prop] &&
          typeof schema.properties[prop] === 'object'
        ) {
          // Recursively assign UIRenderValues for nested properties
          assignUIRenderValues(object[prop], schema.properties[prop]);
        }
      }
    }
  } catch (e) {
    console.error((e as Error).message);
    console.error({ object, schema });
  }

  return schema;
}
