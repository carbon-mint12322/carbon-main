import { NextApiRequest, NextApiResponse } from 'next';
import { getUpdateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { uploadFormFile } from '~/backendlib/upload/file';
import { findSessionUserFromRequest } from '~/backendlib/middleware/with-auth-api';

const schemaId = '/farmbook/landparcel';
const permittedRoles = getUpdateRoles(schemaId);
const modelApi = getModel(schemaId);

const extractRequestFromHttpReq = (req: any) => req.body;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }

  const mods = extractRequestFromHttpReq(req);
  // console.log(`applying mods for /farmbook/landparcel, id: ${id}, mods:`, mods)
  const parsedData = await uploadFormFile(mods);
  const result = await modelApi.update(
    id,
    parsedData,
    (req as any)?.carbonMintUser?._id?.toString(),
  );
  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPostHandler(withMongo(handler))));