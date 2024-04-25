import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { farmerDetailsMobileQuery } from '~/backendlib/db/dbviews/farmer/farmerDetailsMobileQuery';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';

const schemaId = '/farmbook/farmer';
const modelApi = getModel(schemaId);
export const permittedRoles = ['FARMER', 'AGENT'];

export const get = async (id: string) => modelApi.get(id);
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const user = await findSessionUserFromRequest(req, res);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const result = await farmerDetailsMobileQuery(id, user.roles['farmbook']);
  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
