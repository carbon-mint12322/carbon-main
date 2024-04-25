import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { farmerDetailsMobileQuery } from '~/backendlib/db/dbviews/farmer/farmerDetailsMobileQuery';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';
import { intersection } from 'ramda';
import { agentMobileHomeQuery } from '~/backendlib/db/dbviews/agent/agentMobileHomeQuery';
import getAppName from '~/backendlib/locking/getAppName';

const permittedRoles = ['FARMER', 'AGENT', 'PROCESSOR'];

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const query: any = req.query;
    var skip = query.page ? parseInt(query.skip) : 0;
    var items = query.items ? parseInt(query.items) : 500;
    var search = query.search || '';

    const user = await findSessionUserFromRequest(req, res);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    let result;
    if (intersection(user.roles[getAppName()], ['FARMER', 'PROCESSOR']).length !== 0) {
      result = await farmerDetailsMobileQuery(user._id.toString(), user.roles[getAppName()]);
    }
    if (intersection(user.roles[getAppName()], ['AGENT']).length !== 0) {
      result = await agentMobileHomeQuery(user._id.toString(), items, skip, search);
    }
    res.status(200).json({ ...result, role: user.roles[getAppName()][0] });
  } catch (error) {
    console.error(error, ' <-== error while fetching mobile home data');
    throw error;
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
