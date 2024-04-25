import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { httpPostHandler, withMongo } from '~/backendlib/middleware';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';
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

  const {
    id: popId,
    controlPointId,
  }: {
    id: string;
    controlPointId: string;
  } = req.query as any;
  const userId = (req as any)?.carbonMintUser?._id?.toString();

  if (!popId) {
    return res.status(422).json({ error: 'Pop Id required' });
  }

  if (!controlPointId) {
    return res.status(422).json({ error: 'Control Point Id required' });
  }

  const updatedPop = extractRequestFromHttpReq(req);

  delete updatedPop._id;
  delete updatedPop.popId;

  if (!validator(updatedPop)) {
    throw new Error(VALIDATION_ERROR_SLUG, validator.errors);
  }

  const result = await PopModelApi.updateNestedDoc(
    popId,
    'controlPoints',
    { _id: new ObjectId(controlPointId) },
    updatedPop,
    userId,
  );

  return res.json(result);
}

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(createHandler))));
