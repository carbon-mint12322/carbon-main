// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { getListRoles, withPermittedRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { processorListViewQuery } from '~/backendlib/db/dbviews/processor/processorListViewQuery';

const permittedRoles = ['AGENT', 'VIEWER'];

const extractQueryParams = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const filter = extractQueryParams(req);
  const result = await processorListViewQuery(filter);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
