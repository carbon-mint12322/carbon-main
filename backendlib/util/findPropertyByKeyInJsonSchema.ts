type JSONSchema = {
  [key: string]: any;
};

export function findPropertyByKeyInJsonSchema(schema: JSONSchema, key: string): any {
  if (typeof schema === 'object' && schema !== null) {
    // Returns if the items are in 0th level
    if (key in schema) {
      return schema[key];
    }

    // Checks and returns if the property is inside a conditional
    if ('if' in schema) {
      let conditionalResult = findPropertyByKeyInJsonSchema(schema['if'], key);
      if (conditionalResult !== undefined) {
        return conditionalResult;
      }

      if ('then' in schema) {
        conditionalResult = findPropertyByKeyInJsonSchema(schema['then'], key);
        if (conditionalResult !== undefined) {
          return conditionalResult;
        }
      }

      if ('else' in schema) {
        conditionalResult = findPropertyByKeyInJsonSchema(schema['else'], key);
        if (conditionalResult !== undefined) {
          return conditionalResult;
        }
      }
    }

    // Checks if its object and calls the function on each object in recursive format
    for (const prop in schema) {
      // eslint-disable-next-line no-prototype-builtins
      if (schema.hasOwnProperty(prop)) {
        const result = findPropertyByKeyInJsonSchema(schema[prop], key);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }

  // //
  // else if (Array.isArray(schema)) {
  //   for (let i = 0; i < (schema as Array<any>).length; i++) {
  //     const arrayResult = findPropertyByKeyInJsonSchema(schema[i], key);
  //     if (arrayResult !== undefined) {
  //       return arrayResult;
  //     }
  //   }
  // }
}
