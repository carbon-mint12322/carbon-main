import { NextApiRequest, NextApiResponse } from 'next';
import { getGetRoles, withPermittedRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { agentDetailsViewQuery } from '~/backendlib/db/dbviews/agent/agentDetailsViewQuery';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';

const schemaId = '/farmbook/agent';
const modelApi = getModel(schemaId);
export const permittedRoles = getGetRoles(schemaId);

export const get = async (id: string) => modelApi.get(id);
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const user = await findSessionUserFromRequest(req, res);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const result = await agentDetailsViewQuery(user._id.toString());
    res.status(200).json({ ...result, roles: user.roles });
  } catch (error) {
    console.log(error, '  <== error while fetching data');
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(httpGetHandler(withMongo(handler)));
