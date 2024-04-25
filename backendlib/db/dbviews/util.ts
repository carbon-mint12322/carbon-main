const TENANT_NAME = process.env.TENANT_NAME || 'reactml-dev';

export const model2schemaId = (name: string) => `/farmbook/${name}`;

export const model2collection = (name: string) => `/${TENANT_NAME}${model2schemaId(name)}`;
