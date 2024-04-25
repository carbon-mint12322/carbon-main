// const userSchema = require("./gen/jsonschemas/User.json");

const Ajv = require('ajv');
const fsutil = require('../tools/fsutil');

const validate = async (schema, data) => {
  const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

  const validate = ajv.compile(schema);

  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
    throw new Error(validate.errors);
  }
  return valid;
};

const main1 = async () => {
  const schema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'string' },
    },
    required: ['foo'],
    additionalProperties: false,
  };
  const data = {
    foo: 1,
    bar: 'abc',
  };
  return validate(schema, data);
};

const main2 = async () => {
  const schemaStr = await fsutil.preadFile('./gen/jsonschemas/User.json');
  const data = {
    firstName: 'P',
    lastName: 'K',
    phone: '1234',
    identityNumber: '1234',
    identityDocument: 'aadhar',
    identityDocumentFile: 'http://farmbook.carbonmint.com/user/docfile1234',
  };
  const isValid = validate(JSON.parse(schemaStr), data);
  return isValid;
};

main2()
  .then(() => console.log('PASS'))
  .catch((err) => console.error(JSON.stringify(err.message)))
  .finally(() => console.log('DONE'));
