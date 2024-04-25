import { curry, omit } from 'ramda';
import { httpPost, httpGet, httpDelete } from './lib';

const withoutId = omit('id');

// example schemaId: /farmbook/farmer
const createUrl = (schemaId) => `/api${schemaId}`;
const listUrl = (schemaId) => `/api${schemaId}`;
const getUrl = (schemaId, id) => `/api${schemaId}/${id}`;
const updateUrl = (schemaId, id) => `/api${schemaId}/${id}`;
const deleteUrl = (schemaId, id) => `/api${schemaId}/${id}`;

// object creation
export const create = (schemaId, data) => httpPost(createUrl(schemaId), data);

// for detail views
export const get = (schemaId, id) => httpGet(getUrl(schemaId, id));

// for list views
export const list = (schemaId) => httpGet(listUrl(schemaId));

export const update = (schemaId, id, data) => {
  console.log(`Updating [${schemaId}/${id}]`);
  return httpPost(updateUrl(schemaId, id), data);
};

// Create or Update
export const save = (schemaId, data) =>
  data.id ? update(schemaId, data.id, withoutId(data)) : create(schemaId, data);

// Delete
export const remove = (schemaId, id) => httpDelete(deleteUrl(schemaId, id));

// for reference selection
const listUrlWithSchemaId = (schemaId) => `/api${schemaId}`;
export const listWithSchemaId = (schemaId, filter, options) => {
  // TODO - pass filter and options to httpGet

  const url = listUrlWithSchemaId(schemaId);
  return httpGet(url, filter);
};
