import {
  S3Client,
  CopyObjectCommand,
  CopyObjectCommandInput,
  S3ClientConfig,
} from '@aws-sdk/client-s3';

if (
  !(process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
) {
  throw new Error(
    'Missing required environment variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY',
  );
}

const config: S3ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
const s3 = new S3Client(config);

export default function getClient() {
  return s3;
}
