import { NextApiRequest, NextApiResponse } from 'next';
import { getCreateRoles, getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';

import { startWf3 } from '~/backendlib/workflow/engine';
import makeLogger from '~/backendlib/logger';
import getWorkflowDef from '~/gen/workflows';

import { uploadFormFile } from '~/backendlib/upload/file';

const schemaId = T.wfInstSchemaId;
const logger = makeLogger(schemaId);
// This seems wrong...
const permittedRoles = getCreateRoles(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    res.setHeader('Content-Type', 'application/json');
    const inputBody = extractRequestFromHttpReq(req);
    //   const { org, modelName, id }: { org: string; modelName: string; id: string } = req.query;
    const org = req.query.org as string;
    const modelName = req.query.modelName as string; //e.g. crop
    const {
    wfName,
    domainObjectId,
    domainSchemaId,
    eventName,
    eventData,
    }: T.WorkflowStartHandlerInput = inputBody;
    const parsedEventData = await uploadFormFile(eventData);
    if (!org) {
    return res.status(400).json({ error: 'org required' });
    }
    if (!(wfName && domainObjectId && eventName && parsedEventData)) {
    return res.status(400).json({ msg: 'Invalid request' });
    }
    const session = makeWfSession(req);
    if (!session) {
    return res.status(403).json({});
    }
    const eventCreateWfInput: EntityCreateWfInput = {
    wfName,
    modelName,
    parsedEventData,
    domainObjectId,
        domainSchemaId,
    eventName,
    };
    await startCreateEntityWf(eventCreateWfInput, session);
    logger.info('Workflow started');
    res.status(200).json({});
}

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
            responseLimit: false,
        },
    },
};

type EntityCreateWfInput = {
    wfName: string;
    modelName: string;
    parsedEventData: any;
    domainObjectId: string;
    domainSchemaId?: string;
    eventName: string;
};

async function startCreateEntityWf(input: EntityCreateWfInput, session: T.UserSession) {
    const { wfName, modelName, parsedEventData, domainObjectId, eventName, domainSchemaId } = input;
    const _def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(wfName);
    if (!_def) {
        throw new Error('Unknown workflow definition');
    }
    const wfDef = { ..._def, domainSchemaId: `/farmbook/${modelName}` };
    logger.info(`starting workflow ${wfDef.name} for ${wfDef.domainSchemaId}`);
    await startWf3(
        wfDef,
        `/farmbook/${modelName}`,
        undefined,
        domainSchemaId || `/farmbook/collective`,
        domainObjectId,
        eventName,
        parsedEventData,
        session,
    );
}

function makeWfSession(req: NextApiRequest) {
    const org = req.query.org as string;
    const user: any = (req as any).carbonMintUser;
    const userId = user._id.toString();
    const roles: string[] = user.roles[org];
    logger.debug('user', user, 'org', org);
    if (!user) {
        return null;
    }
    if (!(roles && roles.length)) {
        return null;
    }
    const session: any = {
        org,
        userId,
        email: user.email,
        name:
            user.personalDetails?.firstName +
            ' ' +
            (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
        roles,
    };
    return session;
}
