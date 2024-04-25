import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { withMongo } from '~/backendlib/middleware';
import { getModel } from '~/backendlib/db/adapter';
import { httpDeleteHandler } from '~/backendlib/middleware/delete-handler';
import withDebug from '~/backendlib/middleware/with-debug';
import getConfigFromReq from '~/backendlib/nested/util/getConfigFromReq';
import withNestedConfig from '~/backendlib/nested/util/withNestedConfig';
import { withPermittedRoles } from '~/backendlib/rbac';

const permittedRoles = ['AGENT', 'ADMIN'];
const wrap = withPermittedRoles(permittedRoles);

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');

    const { parentId, childId, modelName } = req.query as any;

    const userId = (req as any)?.carbonMintUser?._id?.toString();

    if (!parentId) {
      return res.status(422).json({ error: 'Parent Id required' });
    }

    if (!childId) {
      return res.status(422).json({ error: 'Child Id required' });
    }

    // get params for updating config
    const { model, childResourceParamName } = await getConfigFromReq(req);

    // get parent model
    const row = (await model.get(parentId)) ?? null;

    // throw error if parent not found
    if (!row?._id) throw new Error('Parent not found');

    // get children object
    const childrenArray = row[childResourceParamName];

    // get updated children array
    const updatedChildrenArray = (childrenArray ?? []).filter(
      (childRow: { _id: ObjectId }) => childRow?._id?.toString() !== childId.toString(),
    );

    // updating result
    const result = await model.update(
      row._id,
      { [childResourceParamName]: updatedChildrenArray },
      userId,
    );

    return res.json(result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.status(500).json('Server error');
  }
}

export default withDebug(wrap(httpDeleteHandler(withMongo(withNestedConfig(deleteHandler)))));
