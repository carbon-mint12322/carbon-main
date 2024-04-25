const { HeadObjectCommand } = require('@aws-sdk/client-s3');

import getClient from './client-v3';

const s3 = getClient();

export async function getFileHash(bucketName: string, key: string) {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response: any = await s3.send(command);
  return response.ETag.replace(/"/g, '');
}
