// Generated code - PUT API
import { NextApiRequest, NextApiResponse } from 'next';
import { getListRoles, withPermittedRoles } from '~/backendlib/rbac';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { ObjectId } from 'mongodb';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';

const schemaId = '/farmbook/notification';
const modelApi = getModel(schemaId);
const permittedRoles = [...getListRoles(schemaId), 'FARMER'];

export const updateNotifications = (payload: any, filter = {}, userId: string, options?: any) =>
  modelApi.updateMany(filter, payload, userId, options);

const extractQueryParams = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const params = extractQueryParams(req);
  // const { id }: { id: string } = req.query as any;
  const id = (req as any)?.carbonMintUser?._id?.toString();
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  delete params.id;
  let filter = { $or: [{ receiver: new ObjectId(id) }, { receiver: id }], ...params };

  const { operation } = req.body;
  let payload = {};
  if (operation === 'clear') {
    payload = { active: false };
  } else if (operation === 'read') {
    payload = { status: 'Read' };
  }
  const result = await updateNotifications(payload, filter, id);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(JSON.parse(JSON.stringify(result)));
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(handler))));
