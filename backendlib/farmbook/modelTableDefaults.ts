// generated from template: templates/api/modelTable.ts.mustache

const Ajv = require("ajv")
import { ModelDef } from '~/frontendlib/types';
import { getModel } from "~/backendlib/db/adapter";

import getSchema, { getSchemaList } from "gen/schema-directory";

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

ajv.addFormat('data-url', {
    type: 'string',
    validate: (dataUrl: any) => {
        if (typeof dataUrl === 'string') {
            return true;
        }
        return false; // any test that returns true/false
    },
});

const create = (modelName: string) => (data: any, userId: string) => {
    const schema = getSchema(modelName);
    const validator = ajv.compile(schema);
    const isValid = validator(data);
    if (!isValid) {
        throw new Error(JSON.stringify(validator.errors));
    }
    return getModel(`/farmbook/${modelName}`).create(data, userId);
}

const remove = (modelName: string) => (id: string) =>
    getModel(`/farmbook/${modelName}`).remove(id);
const get = (modelName: string) => (id: string) =>
    getModel(`/farmbook/${modelName}`).get(id);
const list = (modelName: string) => (filter = {}, options?: any) =>
    getModel(`/farmbook/${modelName}`).list(filter, options);
export const update = (modelName: string) => (id: string, mods: any, userId: string) =>
    getModel(`/farmbook/${modelName}`).update(id, mods, userId);

const makeModelDef = (name: string): ModelDef => ({
    name,
    schema: getSchema(name),
    createSchema: getSchema(name),
    createFn: create(name),
    getQueryFn: get(name),
    listQueryFn: list(name),
    updateFn: update(name),
    deleteFn: remove(name),
});

const modelDefs: ModelDef[] = getSchemaList().map(makeModelDef);

export default modelDefs;