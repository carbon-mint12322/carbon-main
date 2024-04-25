import { getModel } from '../../../backendlib/db/adapter';
import { generateLocalId } from '../../../backendlib/db/util';
import { uploadFormFile } from '../../../backendlib/upload/file';

const createEntity = async (ctx) => {
    const { logger, wf, event, session } = ctx;
    const { domainContextObjectId: operatorId, domainSchemaId: schema } = wf;
    logger.debug(`creating ${schema} object`);
    const entityDbApi = getModel(schema);
    const parsedData = await uploadFormFile(event.data);
    let input = {
        ...JSON.parse(JSON.stringify(parsedData)),
        collective: operatorId,
        fbId: generateLocalId(session.org, event.data.type || schema.split('/')[2]),
        status: 'Draft',
    };

    if (input.personalDetails) {
        const userSchemaId = `/farmbook/user`;
        const userModelApi = getModel(userSchemaId);
        logger.debug(`Creating new user for the ${schema} in DB`);
        const role = input.role || 'AGENT';
        const userResult = await userModelApi.create(
            {
                personalDetails: input.personalDetails,
                roles: { [session.org]: [role], farmbook: [role] },
                status: 'Draft',
            },
            session.userId,
        );
        input = { ...input, userId: userResult.insertedId.toString() }
        logger.debug(`${schema} user object created`);
    }
    logger.debug(`Creating new ${schema} in DB`);
    const createResult = await entityDbApi.create(
        {
            ...input,
        },
        session.userId,
    );
    logger.debug(`${schema} object created`);
    wf.domainObjectId = createResult.insertedId;
    return {};
};

export default createEntity;
