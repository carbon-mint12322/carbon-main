import { IJsonSchema } from '../types';

export function resolveJsonSchema(jsonSchema: IJsonSchema): IJsonSchema {
  // Recursive function to traverse the JSON Schema
  function traverseSchema(schema: IJsonSchema): IJsonSchema {
    if (schema.$ref) {
      const { title } = schema;
      // If $ref property is present, resolve the reference from the schema or definitions
      const refSchema = getRefSchema(schema.$ref, jsonSchema);
      if (!refSchema) {
        throw new Error(`Referenced schema '${schema.$ref}' not found`);
      }
      // Recursively traverse the referenced schema
      return traverseSchema({ title, ...(refSchema as any) });
    }

    // If it's an object, traverse its properties
    if (schema.type === 'object' && schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        // Recursively traverse each property schema
        schema.properties[key] = traverseSchema(value);
      }
    }

    // If it's an array, traverse its items
    if (schema.type === 'array' && schema.items) {
      // Recursively traverse the items schema
      schema.items = traverseSchema(schema.items);
    }

    // Return the modified schema
    return schema;
  }

  // Helper function to get a referenced schema by path
  function getRefSchema(refPath: string, currentSchema: IJsonSchema): IJsonSchema | undefined {
    // Check if the reference path starts with '#/'
    if (refPath.startsWith('#/')) {
      // Remove the initial '#' character and split the reference path into parts
      const pathParts = refPath.slice(2).split('/');

      // Traverse each part of the reference path
      let refSchema = currentSchema;
      for (const pathPart of pathParts) {
        // Move to the next level of the schema based on the path part
        refSchema = refSchema[pathPart as keyof typeof refSchema] as IJsonSchema;

        if (!refSchema) {
          return undefined;
        }
      }

      // Return the resolved schema
      return refSchema;
    }

    // If the referenced schema is not found, return undefined
    return undefined;
  }

  // Start the traversal with the input JSON Schema and empty definitions
  const finalSchema = traverseSchema(jsonSchema);

  delete finalSchema.definitions;

  return finalSchema;
}
