import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';

const schemaId = '/farmbook/event';
const modelApi = getModel(schemaId);
export const permittedRoles = ['FARMER', 'AGENT'];

export const get = async (id: string) => modelApi.get(id);
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const result = await get(id);
  res.status(200).json(postProcess(JSON.parse(JSON.stringify(result))));
};

const postProcess = (dbResult: any) => {
  try {
    const result = {
      id: dbResult._id.toString(),
      ts: dbResult.createdAt,
      lat: dbResult.location.lat,
      lng: dbResult.location.lng,
      eventId: dbResult._id.toString(),
      cropId: dbResult.cropId,
      photos: dbResult.photoRecords,
      audio: dbResult.audioRecords,
      notes: dbResult.notes,
    };
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in fb-mobile:event:get:postProcess', e);
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
