// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { getListRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { agentListQuery } from '~/backendlib/db/dbviews/agent/agentListQuery';

const schemaId = '/farmbook/agent';
const permittedRoles = getListRoles(schemaId);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    const result = await agentListQuery(req.query);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

// Wrap in post-handler, which permits http posts only
export default withDebug(httpGetHandler(withMongo(handler)));
