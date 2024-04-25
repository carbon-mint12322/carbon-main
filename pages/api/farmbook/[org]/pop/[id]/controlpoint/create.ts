import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { httpPostHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import { getCreateRoles, getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';

const schemaId = '/farmbook/pop';
const permittedRoles = getCreateRoles(schemaId);
const PopModelApi = getModel(schemaId);

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

import popJsonEventSchema from '~/gen/jsonschemas/add_controlpoint.json';
const VALIDATION_ERROR_SLUG = 'VALIDATION_ERROR';
const Ajv = require('ajv');
const ajv = new Ajv();
ajv.addFormat('hidden', {
  type: 'any',
  validate: (hidden: any) => {
    return true; // any test that returns true/false
  },
});
const validator = ajv.compile(popJsonEventSchema);

const extractRequestFromHttpReq = (req: any) => req.body;

async function createHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const { id: popId }: { id: string } = req.query as any;
  const userId = (req as any)?.carbonMintUser?._id?.toString();

  if (!popId) {
    return res.status(400).json({ error: 'pop Id required' });
  }

  const mods = extractRequestFromHttpReq(req);

  if (!validator(mods)) {
    throw new Error(VALIDATION_ERROR_SLUG, validator.errors);
  }

  const newPop = {
    ...mods,
    _id: new ObjectId(),
  };

  const result = await PopModelApi.add(
    popId,
    {
      controlPoints: newPop,
    },
    userId,
  );

  return res.json({ ...result, upsertedId: newPop._id });
}

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(createHandler))));
