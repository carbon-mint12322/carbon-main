import { NextApiRequest, NextApiResponse } from 'next';
import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

import * as T from '~/backendlib/workflow/types';
import { getWfDbApi } from '~/backendlib/workflow/db';
import { processEvent } from '~/backendlib/workflow/engine';
import getWorkflowDef from '~/gen/workflows';

const schemaId = T.wfInstSchemaId;

const permittedRoles = getUpdateRoles(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'workflow id required' });
  }
  const eventInput = extractRequestFromHttpReq(req);
  const wfApi = getWfDbApi();

  const inst: T.WorkflowInstance = await wfApi.dbLoadInstance(id);
  const session: T.UserSession = {
    userId: (req as any)?.carbonMintUser?._id?.toString(),
  };

  // Lookup definition in statically generated loookup table
  const def: T.MappedWorkflowDefinition | undefined = await getWorkflowDef(inst.def.name);
  if (!def) {
    return res.status(400).json({ error: 'Unknown workflow definition' });
  }
  const result = await processEvent(session, def, eventInput);

  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));
