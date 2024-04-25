import { getModel } from '~/backendlib/db/adapter';

const updateEntity = async (ctx) => {
    const domainObjectData = (ctx.event)?.eventData;
    const domainSchema = ctx.wf.domainSchemaId;
    const domainObjectId = ctx.wf.domainObjectId;
    if (!domainObjectId) {
        console.error('domainObjectId not found in workflow instance');
        return Promise.reject('domainObjectId not found in workflow instance');
    }
    const model = getModel(domainSchema);
    const userId = ctx.session.userId;
    const results = await model.update(domainObjectId, domainObjectData, userId, ctx.dbSession);
    console.debug(`Update ${domainSchema} completed`, { results });
    return;
};

export default updateEntity;