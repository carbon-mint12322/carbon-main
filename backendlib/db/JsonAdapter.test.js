const { default: adapterLib } = require('./JsonAdapter');
const { model2schemaId } = require('./util');
const main = async () => {
  const farmerApi = adapterLib.getModel(model2schemaId('Operator'));
  return farmerApi.list();
};

main().then(console.log).catch(console.error);
