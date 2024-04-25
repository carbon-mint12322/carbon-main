/* eslint-disable no-prototype-builtins */

export interface JSONSchema {
  properties?: {
    [key: string]: JSONSchema;
  };
  required?: string[];
  $id?: string;
  definitions?: {
    [key: string]: JSONSchema;
  };
  type?: Type;
  title?: string;
  enum?: string[];
  default?: string;
  format?: Format;
  $ref?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  jsonschema?: JSONSchema;
  uiHints?: Record<string, any>;
  items?: JSONSchema;
}

export enum Type {
  Boolean = 'boolean',
  Number = 'number',
  Object = 'object',
  String = 'string',
  Array = 'array',
}

export enum Format {
  Date = 'date',
  Hidden = 'hidden',
  DataURL = 'data-url',
  URI = 'uri',
}

export interface DataObj {
  [key: string]: DataObj | string | number | boolean | string[] | DataObj[];
}

const appendTitle = (title: string = '', additionalTitle?: string) => {
  if (additionalTitle) {
    return `${additionalTitle || ''} ${title}`.trim();
  }
  return title;
};

const resolveDefinitionRef = (
  jsonSchemaValue: JSONSchema,
  objValue: DataObj | string | number | boolean | string[] | DataObj[],
  definitions: {
    [key: string]: JSONSchema;
  },
  key: string,
  title: string,
  additionalTitle: string,
  selectedFields: string[],
) => {
  const refRegEx = /^#\/*definitions\/(.*)$/;
  let data: DataObj = {};
  const definitionKey = jsonSchemaValue.$ref?.match(refRegEx)?.[1];
  const definitionsValue = definitionKey && definitions[definitionKey];

  if (definitionKey && definitionsValue) {
    const { title: defTitle = title ?? key } = definitionsValue;

    switch (typeof objValue) {
      case 'string':
      case 'number':
      case 'boolean':
        {
          const newTitle = appendTitle(defTitle, additionalTitle);
          if (!selectedFields?.length || selectedFields.includes(newTitle)) {
            data[newTitle] = objValue;
          }
        }

        break;
      case 'object':
        {
          if (Array.isArray(objValue)) {
            if (
              typeof objValue[0] === 'string' ||
              typeof objValue[0] === 'number' ||
              typeof objValue[0] === 'boolean'
            ) {
              const newTitle = appendTitle(defTitle, additionalTitle);
              if (!selectedFields?.length || selectedFields.includes(newTitle)) {
                data[newTitle] = objValue.join(',');
              }
            } else {
              let arrayData = {};
              objValue.forEach((item, index) => {
                arrayData = {
                  ...arrayData,
                  ...updateKeyWithTitle(
                    definitionsValue.items || {},
                    item as DataObj,
                    appendTitle(`${defTitle} ${index + 1}`, additionalTitle),
                    selectedFields,
                  ),
                };
              });

              data = {
                ...data,
                ...arrayData,
              };
            }
          } else if (
            ('properties' in definitionsValue || '$ref' in definitionsValue) &&
            !Array.isArray(objValue)
          ) {
            data = {
              ...data,
              ...updateKeyWithTitle(
                definitionsValue,
                objValue,
                appendTitle(defTitle, additionalTitle),
                selectedFields,
              ),
            };
          }
        }
        break;
    }
  }
  return data;
};

export const updateKeyWithTitle = (
  { properties = {}, definitions = {}, title: schemaTitle }: JSONSchema,
  dataObj: DataObj,
  additionalTitle = '',
  selectedFields: string[],
): DataObj => {
  let data: DataObj = {};

  for (const [key, jsonSchemaValue] of Object.entries(properties)) {
    if (dataObj.hasOwnProperty(key)) {
      const objValue = dataObj[key];
      const { title: propTitle = key } = jsonSchemaValue;

      switch (typeof objValue) {
        case 'object':
          if (Array.isArray(objValue)) {
            if (Array.isArray(objValue) && typeof objValue[0] === 'string') {
              const newTitle = appendTitle(propTitle, additionalTitle);
              if (!selectedFields?.length || selectedFields.includes(newTitle)) {
                data[newTitle] = objValue.join(',');
              }
            } else {
              let arrayData = {};
              objValue.forEach((item, index) => {
                arrayData = {
                  ...arrayData,
                  ...updateKeyWithTitle(
                    jsonSchemaValue.items || {},
                    item as DataObj,
                    appendTitle(`${propTitle} ${index + 1}`, additionalTitle),
                    selectedFields,
                  ),
                };
              });

              data = {
                ...data,
                ...arrayData,
              };
            }
          } else if ('$ref' in jsonSchemaValue) {
            data = {
              ...data,
              ...resolveDefinitionRef(
                jsonSchemaValue,
                objValue,
                definitions,
                key,
                propTitle,
                additionalTitle,
                selectedFields,
              ),
            };
          } else {
            data = {
              ...data,
              ...updateKeyWithTitle(jsonSchemaValue, objValue, propTitle, selectedFields),
            };
          }
          break;
        case 'string':
        case 'number':
        case 'boolean':
          {
            const newTitle = appendTitle(propTitle, additionalTitle);
            if (!selectedFields?.length || selectedFields.includes(newTitle)) {
              data[newTitle] = objValue;
            }
          }
          break;
      }
    }
  }
  return data;
};

export const getAllFields = ({ properties = {}, definitions = {} }: JSONSchema): string[] => {
  const data: string[] = [];

  for (const [key, jsonSchemaValue] of Object.entries(properties)) {
    const { title: propTitle = key, type, $ref } = jsonSchemaValue;

    switch (type) {
      case 'object':
        {
          const felidsData = getAllFields({ ...jsonSchemaValue, definitions });
          data.push(...felidsData);
        }
        break;
      case 'array':
      case 'string':
      case 'number':
      case 'boolean':
        data.push(propTitle);
        break;
      default:
        {
          if ($ref) {
            const refRegEx = /^#\/*definitions\/(.*)$/;
            const definitionKey = jsonSchemaValue.$ref?.match(refRegEx)?.[1];
            const definitionsValue = definitionKey && definitions[definitionKey];

            const felidsData = getAllFields({ ...definitionsValue, definitions });
            data.push(...felidsData);
          }
        }
        break;
    }
  }
  return data;
};

interface SchemaDefinition {
  [key: string]: string;
}

export const flattenSchemaProperties = (
  { properties = {}, definitions = {} }: JSONSchema,
  parentKey = '',
): SchemaDefinition => {
  let data: SchemaDefinition = {};

  for (const [key, jsonSchemaValue] of Object.entries(properties)) {
    const { title: propTitle, type, $ref } = jsonSchemaValue;

    switch (type) {
      case 'object':
        {
          const flattenedData = flattenSchemaProperties({ ...jsonSchemaValue, definitions }, key);
          data = {
            ...data,
            ...flattenedData,
          };
        }
        break;
      case 'array':
      case 'string':
      case 'number':
      case 'boolean':
        {
          const flattenedKey = parentKey ? `${parentKey}.${key}` : key;
          if (propTitle) {
            data[flattenedKey] = propTitle;
          }
        }
        break;
      default:
        {
          if ($ref) {
            const refRegEx = /^#\/*definitions\/(.*)$/;
            const definitionKey = jsonSchemaValue.$ref?.match(refRegEx)?.[1];
            const definitionsValue = definitionKey && definitions[definitionKey];

            const flattenedData = flattenSchemaProperties(
              { ...definitionsValue, definitions },
              key,
            );
            data = {
              ...data,
              ...flattenedData,
            };
          }
        }
        break;
    }
  }
  return data;
};

type Data = { [key: string]: Data | any };
type FlattenData = { [key: string]: any };

export const flattenData = (
  data: Data[],
  parentKey: string = '',
  sep: string = '.',
): FlattenData[] => {
  return data?.map((item: Data) => {
    const flattenedItem: { [key: string]: any } = {};
    const flattenObject = (obj: Data, parentKey: string) => {
      obj &&
        Object.keys(obj).forEach((key: string) => {
          const newKey = parentKey ? parentKey + sep + key : key;
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            flattenObject(obj[key] as Data, newKey);
          } else {
            flattenedItem[newKey] = obj[key];
          }
        });
    };
    flattenObject(item, parentKey);
    return flattenedItem;
  });
};

export const parseJSONSchema = (schema: any) => {
  if (schema) {
    return JSON.parse(JSON.stringify(schema));
  }
  return null;
};

interface FlattenedData {
  [key: string]: any;
}

interface FlattenedSchema {
  [key: string]: string;
}

interface TitleWithValue {
  [key: string]: any;
}

export const mapSelectedFieldsToData = (
  dataArray: FlattenedData[],
  schema: FlattenedSchema,
  selectedFields: string[],
): TitleWithValue[] => {
  return dataArray.map((dataItem) => {
    const result: { [key: string]: any } = {};

    selectedFields.forEach((field) => {
      const schemaKey = schema[field];
      if (schemaKey) {
        const value = getFieldFromData(dataItem, field);
        result[schemaKey] = value;
      }
    });

    return result;
  });
};

function getFieldFromData(data: FlattenedData, field: string): any {
  let value = null;
  if (data.hasOwnProperty(field)) {
    if (Array.isArray(data[field])) {
      if (typeof data[field][0] === 'object') {
        value = data[field].map((item: any) => Object.values(item).join(', ')).join(', ');
      } else {
        value = data[field].join(', ');
      }
    } else if (typeof data[field] === 'object') {
      value = Object.values(data[field]).join(', ');
    } else {
      value = data[field];
    }
  }
  if (value === undefined) {
    return '';
  }
  return value;
}
