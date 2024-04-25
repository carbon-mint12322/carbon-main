import { NextApiRequest, NextApiResponse } from 'next';
import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';

import { startWf } from '~/backendlib/workflow/engine';
import makeLogger from '~/backendlib/logger';
import getWorkflowDef from '~/gen/workflows';

import { uploadFormFile } from '~/backendlib/upload/file';

const schemaId = T.wfInstSchemaId;

const logger = makeLogger(schemaId);

// This seems wrong...
const permittedRoles = getUpdateRoles(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  // logger.debug('this is req body', req.body);
  const inputBody = extractRequestFromHttpReq(req);
  const org = req.query.org as string;
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
  const user: any = (req as any).carbonMintUser;
  const userId = user._id.toString();
  const roles: string[] = user.roles[org];
  logger.debug('user', user, 'org', org);
  if (!user) {
    return res.status(401);
  }

  if (!(roles && roles.length)) {
    return res.status(403); //forbidden
  }

  if (!(wfName && domainObjectId && eventName && parsedEventData)) {
    return res.status(400).json({ msg: 'Invalid request' });
  }

  const session: any = {
    userId,
    email: user.email,
    name:
      user.personalDetails?.firstName +
      ' ' +
      (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
    roles,
  };
  const _def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(wfName);
  if (!_def) {
    return res.status(400).json({ error: 'Unknown workflow definition' });
  }
  const def = { ..._def, domainSchemaId: domainSchemaId || _def.domainSchemaId };
  logger.info(`starting workflow ${def.name} for ${def.domainSchemaId}, id: ${domainObjectId}`);
  logger.debug(inputBody);
  const result = await startWf(def, domainObjectId, eventName, parsedEventData, session);
  logger.info('Workflow started');
  res.status(200).json({});
};

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
