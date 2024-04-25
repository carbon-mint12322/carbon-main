
import { getModel } from '~/backendlib/db/adapter';

const updatePoultryBatch = async (ctx) => {
    const domainObjectData = (ctx.event)?.eventData;
    delete domainObjectData._id;
    const domainSchema = '/farmbook/poultrybatch';
    const domainObjectId = ctx.wf.domainObjectId;
    if (!domainObjectId) {
        console.error('domainObjectId not found in workflow instance');
        return Promise.reject('domainObjectId not found in workflow instance');
    }
    const model = getModel(domainSchema);
    const userId = ctx.session.userId;
    const results = await model.update(domainObjectId, domainObjectData, userId, ctx.dbSession);
    console.debug('updatePoultryBatch completed', { results });
    return;
};

export default updatePoultryBatch;