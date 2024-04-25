// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { getListRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';
import { getModel } from '~/backendlib/db/adapter';
import { eventListMobileQuery } from '~/backendlib/db/dbviews/event/eventListMobileQuery';

const schemaId = '/farmbook/event';
const permittedRoles = ['FARMER', 'AGENT'];
const modelApi = getModel(schemaId);
const cropSchemaId = '/farmbook/crop';
const cropApi = getModel(cropSchemaId);

const extractQueryParams = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const filter = extractQueryParams(req);
  if (!filter.farmerId) {
    return res.status(400).json({ error: 'farmerId is required' });
  }
  const user = await findSessionUserFromRequest(req, res);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const result = await eventListMobileQuery(filter.farmerId);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result.length ? result[0] : []);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
