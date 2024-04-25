import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { landParcelDetailsViewQuery } from '~/backendlib/db/dbviews/landparcel/landParcelDetailsViewQuery';

const schemaId = '/farmbook/landparcel';
const modelApi = getModel(schemaId);
export const permittedRoles = ['FARMER', 'VIEWER'];

export const get = async (id: string) => modelApi.get(id);
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const result = await landParcelDetailsViewQuery(id);
  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));