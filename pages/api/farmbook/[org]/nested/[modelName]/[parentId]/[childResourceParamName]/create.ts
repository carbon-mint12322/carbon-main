import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateLocalId } from '~/backendlib/db/util';
import { httpPostHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import getConfigFromReq from '~/backendlib/nested/util/getConfigFromReq';
import withNestedConfig from '~/backendlib/nested/util/withNestedConfig';
import { withPermittedRoles } from '~/backendlib/rbac';
import { uploadFormFile } from '~/backendlib/upload/file';

const permittedRoles = ['AGENT', 'ADMIN'];
const wrap = withPermittedRoles(permittedRoles);

const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';

async function createHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { org, parentId } = req.query as any;

    if (!parentId) {
      return res.status(422).json({ error: 'Parent Id required' });
    }

    const userId = (req as any).carbonMintUser._id?.toString();

    const mods = req.body as any;

    
    // get params for updating config
    const { model, childResourceParamName, validator, uiSchema, createFn } = await getConfigFromReq(req);
    
    if (!validator(mods)) {
      throw new Error(VALIDATION_ERROR_SLUG);
    }

    const parsedData = (await uploadFormFile(mods)) as object;

    const newChild = {
      ...parsedData,
      _id: new ObjectId(),
      fbId: generateLocalId(org, childResourceParamName),
      schemaName : uiSchema,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    };

    if (!createFn) {

      const result = await model.add(
        parentId,
        {
          [childResourceParamName]: newChild,
        },
        userId,
      );

      return res.json({ ...result, upsertedId: newChild._id });
    } else {
      const result = await createFn(newChild, parentId);
      return res.json(result);
    }
      
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);

    if (e instanceof Error && e.message.includes(VALIDATION_ERROR_SLUG)) {
      return res.status(422).json('Validation failed.');
    }
    return res.status(500).json({ error: e?.message });
  }
}

// TODO: Add wrap
export default withDebug(wrap(httpPostHandler(withMongo(withNestedConfig(createHandler)))));
