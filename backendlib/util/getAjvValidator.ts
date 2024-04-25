const Ajv = require('ajv');

/** */
export function getAjvValidator(schemaFile: any) {
  const ajv = new Ajv();
  ajv.addFormat('hidden', {
    type: 'any',
    validate: (hidden: any) => {
      return true; // any test that returns true/false
    },
  });

  return ajv.compile(schemaFile);
}
