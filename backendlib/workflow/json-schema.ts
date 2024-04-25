import Ajv from 'ajv';

const ajvOptions: any = { strict: false, formats: { 'data-url': true, 'hidden': true } };
const ajvCompile = (schema: any) => new Ajv(ajvOptions).compile(schema);
const ajvRun = (data: any) => async (ajvValidator: any) =>
  ajvValidator(data) ? { isValid: true } : Promise.reject(ajvValidator.errors);


export const jschemaValidate = async (schema: any, data: any) =>
  Promise.resolve(schema).then(ajvCompile).then(ajvRun(data));
