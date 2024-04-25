import { has } from 'lodash';

export function convertObjectToTitleUIRenderValue(jsonSchemaWithValues: any): Record<string, any> {
  function traverse(obj: any): Record<string, any> {
    let res: Record<string, any> = {};

    for (let key in obj) {
      const property = obj[key];

      const propertyTitle = isValidString(property.title) ? property.title : key;

      if (property.type === 'array' && has(property, 'items.properties')) {
        res[propertyTitle] = replaceKeysWithTitles(property).UIRenderValue;
      } else if (property.properties) {
        res[propertyTitle] = traverse(property.properties);
      } else if (property.UIRenderValue) {
        res[propertyTitle] = property.UIRenderValue;
      }
    }

    return res;
  }

  return traverse(jsonSchemaWithValues);
}

function isValidString(str: any) {
  return str && typeof str === 'string' && str.length > 0;
}

function replaceKeysWithTitles(jsonObj: Record<string, any>) {
  const UIRenderValue = Array.isArray(jsonObj.UIRenderValue) ? jsonObj.UIRenderValue : [];

  UIRenderValue.forEach((item: Record<string, any>) => {
    for (const key in item) {
      const title = jsonObj.items.properties[key].title;

      const finalTitle = isValidString(title) ? title : key;

      item[finalTitle] = item[key];
      delete item[key];
    }
  });

  return jsonObj;
}
