// Generated code

import { NextApiRequest, NextApiResponse } from 'next';
import { getEventCreateRoles, withPermittedRoles } from '~/backendlib/rbac';

import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';

const schemaId = `/farmbook/map`;
const permittedRoles = ['AGENT', 'FARMER', 'FIELD_OFFICER'];
const modelApi = getModel(schemaId);

import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';
import { getModel } from '~/backendlib/db/adapter';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    const user = await findSessionUserFromRequest(req, res);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!req.body.name) {
      return res.status(401).json({ error: 'Name is required' });
    }

    if (!req.body.map) {
      return res.status(401).json({ error: 'Map is required' });
    }
    const result = await modelApi.create(
      { name: req.body.name, map: req.body.map },
      user._id.toString(),
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error: any) {
    console.log('ERROR in saving map from mobile - ', error);
    res.status(500).json({ error: JSON.parse(error.message) });
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default wrap(withDebug(httpPostHandler(withMongo(handler))));
