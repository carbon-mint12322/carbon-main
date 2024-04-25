import { GridFSBucket } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/middleware/rbac';
import withDebug from '~/backendlib/middleware/with-debug';
import { httpGetHandler } from '~/backendlib/middleware';
import withMongo from '~/backendlib/middleware/with-mongo';
import { connect } from '~/backendlib/upload/file';

const permittedRoles = ['AGENT'];
// Download a file
const streamFile = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const id = req.query.id;
  // example id: /gridfs:evlocker-dev/photo-1657724001855--sample.jpg
  // @ts-ignore
  const [_, store, filename] = id.split('/');
  const [__, bucketName] = store.split(':');

  try {
    const db = await connect();
    const bucket = new GridFSBucket(db, { bucketName });
    bucket
      .find({
        filename: filename,
      })
      .toArray((err, files) => {
        if (!files || (files && (!files[0] || files?.length === 0))) {
          return res.status(200).json({
            success: false,
            message: 'No files available',
          });
        }
        res.setHeader('Cache-Control', 'max-age=604800, s-maxage=604800, stale-while-revalidate');
        bucket.openDownloadStreamByName(filename).pipe(res);
      });
  } catch (error: any) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  return await streamFile(req, res);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
