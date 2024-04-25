import { getModel } from '~/backendlib/db/adapter';

const deleteEntity = async (ctx) => {
    const domainSchema = ctx.wf.domainSchemaId;
    const domainObjectId = ctx.wf.domainObjectId;
    if (!domainObjectId) {
        console.error('domainObjectId not found in workflow instance');
        return Promise.reject('domainObjectId not found in workflow instance');
    }
    const model = getModel(domainSchema);
    const results = await model.remove(domainObjectId);
    console.debug(`Delete ${domainSchema} farmer completed`, { results });
    return;
};

export default deleteEntity;