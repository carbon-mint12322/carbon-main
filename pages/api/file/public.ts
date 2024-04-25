import { GridFSBucket } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import withDebug from '~/backendlib/middleware/with-debug';
import { httpGetHandler } from '~/backendlib/middleware';
import withMongo from '~/backendlib/middleware/with-mongo';
import { connect } from '~/backendlib/upload/file';

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
        if (files?.[0]?.metadata?.contentType === 'text/csv') {
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${files?.[0]?.metadata.originalFileName}"`,
          );
        } else if (
          files?.[0]?.metadata?.contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          );
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${files?.[0]?.metadata.originalFileName}"`,
          );
        } else {
          res.setHeader('x-image-meta-property-timestamp', files?.[0]?.metadata?.timestamp || '');
          res.setHeader(
            'x-image-meta-property-location-lat',
            files?.[0]?.metadata?.location?.lat || '',
          );
          res.setHeader(
            'x-image-meta-property-location-lng',
            files?.[0]?.metadata?.location?.lng || '',
          );
          res.setHeader('Cache-Control', 'max-age=604800, s-maxage=604800, stale-while-revalidate');
        }
        bucket.openDownloadStreamByName(filename).pipe(res);
      });
  } catch (error: any) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  return await streamFile(req, res);
};

// Wrap in post-handler, which permits http posts only
export default withDebug(httpGetHandler(withMongo(handler)));
