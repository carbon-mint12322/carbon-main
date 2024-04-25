import { GridFSBucket, ObjectId } from 'mongodb';

async function readAttachment(url: string, db: any): Promise<Buffer | string> {
  if (/gridfs/.test(url)) {
    return fetchGridFsFile(url, db);
  }
  return Promise.reject(new Error('Invalid file type (not gridfs)'));
}

async function fetchGridFsFile(url: string, db: any): Promise<Buffer | string> {
  // expected format of url is:
  // https://organova.carbonmint.com/api/file/public?id=/gridfs:organova/photoEvidenceBeforeAfter-1677581475745--Bund preparation .jpg
  const [_prefix, id] = url.split('?id=');
  const [_, store, filename] = id.split('/');
  const [__, bucketName] = store.split(':');
  const bucket = new GridFSBucket(db, { bucketName });
  return new Promise((resolve, reject) => {
    bucket
      .find({
        filename: filename,
      })
      .toArray((err, files) => {
        if (err) {
          console.error('Error fetching file', err);
          return resolve([].join(''));
        }
        if (!files || (files && (!files[0] || files?.length === 0))) {
          return resolve(''); // to work around database issues in dev
          // return reject(new Error('No files available'));
        }
        const chunks: any[] = [];
        const downloadStream = bucket.openDownloadStream(new ObjectId(files[0]._id));
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        downloadStream.on('error', (err) => reject(err));
        downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
      });
  });
}
export default readAttachment;
