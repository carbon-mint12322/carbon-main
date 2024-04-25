import { NextApiRequest, NextApiResponse } from 'next';
import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';
import { getWfDbApi } from '~/backendlib/workflow/db';
import { processEvent } from '~/backendlib/workflow/engine';
import getWorkflowDef from '~/gen/workflows';
import { uploadFormFile } from '~/backendlib/upload/file';

const schemaId = T.wfInstSchemaId;

const permittedRoles = getUpdateRoles(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { org, id }: { org: string; id: string } = req.query as any;
  if (!(org && id)) {
    return res.status(400).json({ error: 'workflow id required' });
  }
  const eventInput = extractRequestFromHttpReq(req);
  const wfApi = getWfDbApi();

  const inst: T.WorkflowInstance = await wfApi.dbLoadInstance(id);
  const user: any = (req as any).carbonMintUser;
  const userId = user._id.toString();
  const roles: string[] = user.roles[org];
  const session: any = {
    userId,
    email: user?.personalDetails?.email || userId,
    roles,
    name:
      user?.personalDetails?.firstName +
      ' ' +
      (user?.personalDetails?.lastName ? user?.personalDetails?.lastName : ''),
  };
  // Lookup definition in statically generated lookup table
  const def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(inst.def.name);
  if (!def) {
    return res.status(400).json({ error: 'Unknown workflow definition' });
  }
  try {
    const parsedEventData = await uploadFormFile(eventInput.eventData);
    const result = await processEvent(session, def, {
      ...eventInput,
      eventData: parsedEventData,
      data: eventInput.eventData.details,
      wfInstanceId: id,
      validationLifeCycleData: parsedEventData,
    });
    res.status(200).json(result);
  } catch (err: any) {
    console.error('Promise rejection', err);
    res.status(500).json({ error: err.toString() });
  }
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
