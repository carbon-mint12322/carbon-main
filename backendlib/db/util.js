const model2schemaId = (modelName) => `/farmbook/${modelName}`;

const generateLocalId = (org, entity, index = 0) =>
  org.substring(0, 3).toUpperCase() +
  '-' +
  entity.substring(0, 1).toUpperCase() +
  entity.substring(entity.length - 1, entity.length).toUpperCase() +
  '-' +
  (Date.now() + index)
    .toString()
    .substring(Date.now().toString().length - 4, Date.now().toString().length);

module.exports = { model2schemaId, generateLocalId };
