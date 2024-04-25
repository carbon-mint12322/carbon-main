const { uniq, flatten } = require('lodash');

function listReferences(schemaObj) {
  if (!schemaObj) {
    return [];
  }
  if (Array.isArray(schemaObj)) {
    return schemaObj.flatMap(listReferences);
  }
  if (!typeof schemaObj === 'object') {
    return [];
  }
  const keys = Object.keys(schemaObj);
  if (keys.length === 0) {
    return [];
  }
  return keys.flatMap((key) => {
    const value = schemaObj[key];
    if (key === '$ref') {
      return [value.replace('#/definitions/', '')];
    }
    if (Array.isArray(value)) {
      return value.flatMap(listReferences);
    }
    if (typeof value === 'object') {
      return listReferences(value);
    }
    return [];
  });
}

function cleanupDefinitions(schemaObj) {
  const { definitions, ...coreJsonSchema } = schemaObj;
  // Traverse through jsonSchema props and retrieve definition node names
  const definitionNames = listReferences(coreJsonSchema);
  // Traverse schemas within defintions node and make a list of
  // definition names that are used by definitionNames array
  const usedDefinitionNames = definitionNames.flatMap((definitionName) => {
    const definition = definitions[definitionName];
    return listReferences(definition);
  });
  const relevantNames = uniq(flatten([definitionNames, usedDefinitionNames]));
  // Keep definition names that are used in the core json schema,
  // and remove the rest from definitionNames
  const definitions2 = relevantNames.reduce((acc, name) => {
    return { ...acc, [name]: definitions[name] };
  }, {});

  return { ...coreJsonSchema, definitions: definitions2 };
}

module.exports = { cleanupDefinitions };
