import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';
import { httpGetHandler, httpPostHandler, withMongo } from '~/backendlib/middleware';
import { httpDeleteHandler } from '~/backendlib/middleware/delete-handler';
import withDebug from '~/backendlib/middleware/with-debug';
import { Pop } from '~/backendlib/pop/types';
import { getCreateRoles, getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';

const schemaId = '/farmbook/pop';
const permittedRoles = getCreateRoles(schemaId);
const PopModelApi = getModel(schemaId);

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
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

  const popModel = await PopModelApi.get(popId);

  const updatedControlPoints = (popModel?.controlPoints ?? []).filter(
    (cp: Pop) => cp?._id?.toString() !== controlPointId,
  );

  const result = await PopModelApi.update(popId, { controlPoints: updatedControlPoints }, userId);

  return res.json(result);
}

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpDeleteHandler(withMongo(deleteHandler))));
