import { JSONSchema7 } from 'json-schema';

export interface IPlugin {
  name: string;
  ui: {
    themeOptions: object;
  };
  schema: JSONSchema7;
}
