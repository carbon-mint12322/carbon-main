// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { getListRoles, withPermittedRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { getAuthAdapter } from '~/backendlib/middleware/with-auth-api';
import { IAuthRecord } from '~/backendlib/middleware/adapters/types';
import { ObjectId, ObjectID } from 'mongodb';
import moment from 'moment';

const schemaId = '/farmbook/notification';
const modelApi = getModel(schemaId);
const permittedRoles = [...getListRoles(schemaId), 'FARMER'];

export const listNotifications = (filter = {}, options?: any) => modelApi.list(filter, options);
const extractQueryParams = (req: any) => req.query;

// Supporting function for getServerSideProps
export const listGssp = async (context: any) => {
  // filter ???
  const data = await listNotifications();
  return { props: { data } };
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const params = extractQueryParams(req);

  const id = (req as any)?.carbonMintUser?._id?.toString();
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  delete params.id;
  let filter = {
    $or: [{ receiver: new ObjectId(id) }, { receiver: id }],
    active: true,
    category: 'Plan',
    createdAt: { $gte: moment().subtract(7, 'day').startOf('day').toISOString() },
    ...params,
  };
  const sort = {
    createdAt: -1,
  };
  const result = await listNotifications(filter, { sort });
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(postProcess(JSON.parse(JSON.stringify(result))));
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      id: item._id.toString(),
      ...item,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in farmbook:notification:list:postProcess', e);
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));

// Permission wrapping for getServerSideProps
const wrapGssp = withPermittedRolesGssp(permittedRoles);
export const listGssp2 = wrapGssp(listGssp);
