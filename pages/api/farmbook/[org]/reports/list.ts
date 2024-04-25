// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { reportListViewQuery } from '~/backendlib/db/dbviews/reports/reportList';

const permittedRoles = ['ADMIN', 'AGENT'];

const extractQueryParams = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    const { org, ...filter } = extractQueryParams(req);
    const result = await reportListViewQuery(filter);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in reportList:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
