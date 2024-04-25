import { CopyObjectCommand, CopyObjectCommandInput } from '@aws-sdk/client-s3';
import getClient from './client-v3';

const s3 = getClient();

export async function copyS3File(
  sourceBucket: string,
  sourceKey: string,
  destinationBucket: string,
  destinationKey: string,
  isPublic: boolean,
): Promise<any> {
  const copyObjectParams: CopyObjectCommandInput = {
    Bucket: destinationBucket,
    CopySource: `${sourceBucket}/${sourceKey}`,
    Key: destinationKey,
    ACL: isPublic ? 'public-read' : undefined,
  };
  const result = await s3.send(new CopyObjectCommand(copyObjectParams));
  return result;
}
