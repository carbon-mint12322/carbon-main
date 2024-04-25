import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { httpGetHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import getConfigFromReq from '~/backendlib/nested/util/getConfigFromReq';
import withNestedConfig from '~/backendlib/nested/util/withNestedConfig';
import { withPermittedRoles } from '~/backendlib/rbac';

const permittedRoles = ['AGENT', 'ADMIN'];
const wrap = withPermittedRoles(permittedRoles);

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');

    const { parentId } = req.query as any;

    if (!parentId) {
      return res.status(422).json({ error: 'Parent Id required' });
    }

    // get params for updating config
    const { model, childResourceParamName } = await getConfigFromReq(req);

    // get parent model
    const row = (await model.get(parentId)) ?? null;

    // throw error if parent not found
    if (!row?._id) throw new Error('Parent not found');

    // get children object
    const childrenArray = row[childResourceParamName];

    return res.json(childrenArray);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    return res.status(500).json('Server error');
  }
}

// TODO: wrap with confif to get permitted roles
export default withDebug(wrap(httpGetHandler(withMongo(withNestedConfig(getHandler)))));
