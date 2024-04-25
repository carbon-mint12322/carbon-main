const Ajv = require('ajv');

import makeLogger from '../logger';

const logger = makeLogger('wf-validate');

// Actually this is not required because JSON schema validates this
// This is an example only
const checkName = (wfdef) =>
  (wfdef.name && { valid: true }) || { valid: false, error: 'workflow name is required' };

// Any checks beyond json schema validation
const validateWfDefIntegrity = (wfdef) => {
  const checks = [checkName];
  return checks.map((fn) => fn(wfdef)).filter((result) => !result.valid);
};

export const validateWfDefSync = (schema, defn) => {
  const validator = new Ajv({ strict: false }).compile(schema, { strict: false });
  // eslint-disable-next-line
  const jschemaValidationRes = validator(defn);
  if (validator.errors && validator.errors.length) {
    //console.log(validator.errors)
    console.error('Invalid schema', defn.name);
    logger.info('JSONSchema errors: ', validator.errors);
    throw new Error('WF definition does not conform to schema');
  }
  const results = validateWfDefIntegrity(defn);
  return results.length === 0 ? 'Valid' : results;
};

export const validateWfDef = validateWfDefSync;

module.exports = { validateWfDef, validateWfDefSync };
