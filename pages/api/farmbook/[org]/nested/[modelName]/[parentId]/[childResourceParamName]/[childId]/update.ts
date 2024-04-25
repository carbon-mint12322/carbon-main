import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { withMongo } from '~/backendlib/middleware';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';
import withDebug from '~/backendlib/middleware/with-debug';
import getConfigFromReq from '~/backendlib/nested/util/getConfigFromReq';
import withNestedConfig from '~/backendlib/nested/util/withNestedConfig';
import { withPermittedRoles } from '~/backendlib/rbac';
import { uploadFormFile } from '~/backendlib/upload/file';

const permittedRoles = ['AGENT', 'ADMIN'];
const wrap = withPermittedRoles(permittedRoles);

const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';

async function createHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Content-Type', 'application/json');

    const { parentId, childId } = req.query as any;

    if (!parentId) {
      return res.status(422).json({ error: 'Parent Id required' });
    }

    if (!childId) {
      return res.status(422).json({ error: 'Child Id required' });
    }

    const userId = (req as any)?.carbonMintUser?._id?.toString();
      
    // get params for updating config
    const { model, childResourceParamName, schema, validator } = await getConfigFromReq(req);

    //
    const { _id, addCP, parentId: pid, ...childProps } = req.body as any;

    //
    if (!validator(childProps)) {
      throw new Error(VALIDATION_ERROR_SLUG);
    }

    const parsedData = (await uploadFormFile(childProps)) as object;

    const result = await model.updateNestedDoc(
      parentId,
      childResourceParamName,
      { _id: new ObjectId(childId.toString()) },
      parsedData,
      userId,
    );

    return res.json(result);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);

    if (e instanceof Error && e.message.includes(VALIDATION_ERROR_SLUG)) {
      return res.status(422).json('Validation failed.');
    }
    return res.status(500).json({ error: e?.message });
  }
}

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(withNestedConfig(createHandler)))));
