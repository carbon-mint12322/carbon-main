import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { httpGetHandler, httpPostHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import { Pop } from '~/backendlib/pop/types';
import { getCreateRoles, getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';

const schemaId = '/farmbook/schemepop';
const permittedRoles = getCreateRoles(schemaId);
const PopModelApi = getModel(schemaId);

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

async function createHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');

  const {
    id: popId,
    compliancePointId,
  }: {
    id: string;
    compliancePointId: string;
  } = req.query as any;
  const userId = (req as any)?.carbonMintUser?._id?.toString();

  if (!popId) {
    return res.status(422).json({ error: 'Pop Id required' });
  }

  if (!compliancePointId) {
    return res.status(422).json({ error: 'Compliance Point Id required' });
  }

  const popModel = await PopModelApi.get(popId);

  const compliancePoint = (popModel?.compliancePoints ?? []).find(
    (cp: Pop) => cp?._id?.toString() === compliancePointId,
  );

  return res.json(compliancePoint);
}

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(createHandler))));
