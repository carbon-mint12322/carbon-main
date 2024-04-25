import { curry } from 'ramda';
import { useQuery, useMutation } from '@tanstack/react-query';
import { create, get, list, listWithSchemaId, update, save, remove } from './crud';

const modelName2SchemaId = (modelName) => `/farmbook/${modelName}`;

export const createWithRQ = curry((modelName, data) =>
  useMutation(`${modelName}.create}`, () => create(modelName, data)),
);

export const getWithRQ = curry((modelName, id, options) =>
  useQuery(
    [`${modelName}.get`, modelName, id],
    () => get(modelName2SchemaId(modelName), id),
    options,
  ),
);

export const getWithRQBySchemaId = curry((schemaId, id, options) =>
  useQuery([`${schemaId}.get`, schemaId, id], () => get(schemaId, id), options),
);

export const listWithRQ = curry((modelName, options) =>
  useQuery([`${modelName}.list`], () => list(modelName2SchemaId(modelName)), options),
);

export const updateWithRQ = curry((modelName, id, data) =>
  useMutation(`${modelName}.update:${id}`, () => update(modelName2SchemaId(modelName), id, data)),
);

export const saveWithRQ = (modelName, options) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMutation((data) => save(modelName2SchemaId(modelName), data), options);

export const deleteWithRQ = curry((modelName, id) =>
  useMutation(`${modelName}.delete:${id}`, () => remove(modelName2SchemaId(modelName), id)),
);

export const removeWithRQ = deleteWithRQ;

export const foreignSchemaRQ = (schemaId, filter, options) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useQuery([`${schemaId}.list`], () => listWithSchemaId(schemaId, filter, options), options);
