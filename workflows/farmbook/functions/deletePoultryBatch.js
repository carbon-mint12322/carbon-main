import { getModel } from '~/backendlib/db/adapter';

const deletePoultryBatch = async (ctx) => {
  const domainSchema = '/farmbook/poultrybatch';
  const domainObjectId = ctx.wf.domainObjectId;
  if (!domainObjectId) {
    console.error('domainObjectId not found in workflow instance');
    return Promise.reject('domainObjectId not found in workflow instance');
  }
  const model = getModel(domainSchema);
  const results = await model.remove(domainObjectId);
  console.debug('delete poultry batch completed', { results });
  return;
};

export default deletePoultryBatch;
