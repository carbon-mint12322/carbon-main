import { getModel } from '~/backendlib/db/adapter';
import { WorkflowContext } from '~/backendlib/workflow/types';

const updateCropEvent = async (ctx: WorkflowContext) => {
  const domainObjectData = (ctx.event as any)?.eventData;
  const domainSchema = '/farmbook/event';
  const domainObjectId = ctx.wf.domainObjectId;
  if (!domainObjectId) {
    console.error('domainObjectId not found in workflow instance');
    return Promise.reject('domainObjectId not found in workflow instance');
  }
  const model = getModel(domainSchema);
  const userId = ctx.session.userId;

  const results = await model.update(domainObjectId, domainObjectData, userId, ctx.dbSession);
  console.debug('updateCropEvent completed', { results });
  return;
};

export default updateCropEvent;
