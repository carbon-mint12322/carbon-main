import { NextApiRequest, NextApiResponse } from 'next';
import { getGetRoles, withPermittedRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';

const schemaId = '/tenant';
const modelApi = getModel(schemaId);
export const permittedRoles = getGetRoles(schemaId);

export const get = async (id: string) => modelApi.findOneAtRoot({ subdomain: id });
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const result = await get(id);
  res.status(200).json(result);
};

// Wrap in post-handler, which permits http posts only
export default withDebug(httpGetHandler(withMongo(handler)));
