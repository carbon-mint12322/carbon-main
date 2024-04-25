import { getModel } from '~/backendlib/db/adapter';

const deleteFarmer = async (ctx) => {
  const domainSchema = '/farmbook/farmer';
  const domainObjectId = ctx.wf.domainObjectId;
  if (!domainObjectId) {
    console.error('domainObjectId not found in workflow instance');
    return Promise.reject('domainObjectId not found in workflow instance');
  }
  const model = getModel(domainSchema);
  const results = await model.remove(domainObjectId);
  console.debug('delete farmer completed', { results });
  return;
};

export default deleteFarmer;
