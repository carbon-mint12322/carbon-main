import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const AWS_REGION = process.env.AWS_REGION;
const S3_QR_BUCKET_ID = process.env.S3_QR_BUCKET_ID;
const S3_PUBLIC_BUCKET_ID = process.env.S3_PUBLIC_BUCKET_ID;
const S3_PRIVATE_BUCKET_ID = process.env.S3_PRIVATE_BUCKET_ID;

if (!AWS_REGION || !S3_QR_BUCKET_ID || !S3_PUBLIC_BUCKET_ID || !S3_PRIVATE_BUCKET_ID) {
  throw new Error(
    'Missing required environment variables: AWS_REGION, S3_QR_BUCKET_ID, S3_PUBLIC_BUCKET_ID, S3_PRIVATE_BUCKET_ID',
  );
}

type S3Options = {
  isPublic: boolean;
  ContentType?: string;
};

export async function writeFile(
  bucketId: string,
  fileName: string,
  content: any,
  metadata: any,
  options: S3Options,
) {
  const aclOptions = {
    ACL: options.isPublic ? 'public-read' : 'private'
  }
  const ContentType = options.ContentType || fileName2ContentType(fileName);
  const uploadResult = await s3
    .putObject({
      Bucket: bucketId,
      Key: fileName.trim(),
      Body: content,
      Metadata: metadata,
      ContentType,
      ...aclOptions
    })
    .promise();
  return constructARN(bucketId, fileName.trim());
}

export async function writeFileWithOptions(
  fileName: string,
  content: any,
  metadata: any = {},
  options: S3Options,
) {
  if (!(S3_PUBLIC_BUCKET_ID && S3_PRIVATE_BUCKET_ID)) {
    return Promise.reject(
      new Error(
        'Missing required environment variables: S3_PUBLIC_BUCKET_ID, S3_PRIVATE_BUCKET_ID',
      ),
    );
  }
  return writeFile(
    options.isPublic ? S3_PUBLIC_BUCKET_ID : S3_PRIVATE_BUCKET_ID,
    fileName,
    content,
    metadata,
    options,
  );
}

export async function writePublicFile(
  bucketId: string,
  fileName: string,
  content: any,
  metadata: any,
) {
  const uploadResult = s3
    .putObject({
      Bucket: bucketId,
      Key: fileName,
      Body: content,
      Metadata: metadata,
      ACL: 'public-read',
      ContentType: fileName2ContentType(fileName),
      // LockMode: 'COMPLIANCE',
      // LockRetainUntilDate: '2122-12-31T00:00:00.000Z',
    })
    .promise();
  return constructARN(bucketId, fileName);
}

const ONE_DAY: number = 60 * 60 * 24;

export async function createPresignedUrlFromArn(arn: string, expireSecs: number = ONE_DAY) {
  const { bucketId, fileName } = parseARN(arn);
  return s3.getSignedUrlPromise('getObject', {
    Bucket: bucketId,
    Key: fileName,
    Expires: expireSecs,
  });
}

export async function readFile(bucketId: string, fileName: string) {
  return s3
    .getObject({
      Bucket: bucketId,
      Key: fileName,
    })
    .promise();
}

// Streams file to S3 and returns its ARN
export async function streamFileToS3(fileName: string, stream: any) {
  const bucketId = S3_PRIVATE_BUCKET_ID;
  const uploadResult = s3
    .upload({
      Bucket: bucketId,
      Key: fileName,
      Body: stream,
    })
    .promise();
  const arn = constructARN(uploadResult.Bucket, uploadResult.Key);
  // console.log({ msg: 'Uploaded', arn, fileName, bucketId });
  return arn;
}

export function streamFromS3(arn: string) {
  const { bucketId, fileName } = parseARN(arn);
  // console.log({ arn, bucketId, fileName });
  return s3
    .getObject({
      Bucket: bucketId,
      Key: fileName,
    })
    .createReadStream();
}

export async function readARN(arn: string) {
  const { bucketId, fileName } = parseARN(arn);
  return readFile(bucketId, fileName);
}

export async function readFileWithUrl(url: string) {
  const re = /s3:\/\/([^\/]+)\/(.+)/;
  const match = url.match(re);
  if (!match) {
    throw new Error(`Invalid S3 URL: ${url}`);
  }
  const bucketId = match[1];
  const fileName = match[2];
  return readFile(bucketId, fileName);
}

export async function deleteFile(bucketId: string, fileName: string) {
  return s3
    .deleteObject({
      Bucket: bucketId,
      Key: fileName,
    })
    .promise();
}

export async function listFiles(bucketId: string, prefix: string) {
  return s3
    .listObjects({
      Bucket: bucketId,
      Prefix: prefix,
    })
    .promise();
}

export async function listBuckets() {
  return s3.listBuckets().promise();
}

export async function createBucket(bucketId: string) {
  return s3.createBucket({ Bucket: bucketId }).promise();
}

export async function deleteBucket(bucketId: string) {
  return s3.deleteBucket({ Bucket: bucketId }).promise();
}

export async function getBucketLocation(bucketId: string) {
  return s3.getBucketLocation({ Bucket: bucketId }).promise();
}

export function getBucketUrl(bucketId: string) {
  return `https://${bucketId}.s3.amazonaws.com`;
}

export function getBucketFileUrl(bucketId: string, fileName: string) {
  // const file = fileName.split('/');
  // const eventId = file[file.length - 3];
  // const timestamp = file[file.length - 2];
  // const name = file[file.length - 1];
  // return `https://qr.carbonmint.com/qr/${bucketId}/${eventId}/${timestamp}/${name}`;
  return `https://${bucketId}.s3.amazonaws.com/${fileName}`;
}

export function getQrBucketId(): string {
  if (!S3_QR_BUCKET_ID) {
    throw new Error('S3_QR_BUCKET_ID not set');
  }
  return S3_QR_BUCKET_ID;
}

export const arnRe = /arn:aws:s3:([^:]+):([^:]+):(.+)/;
export function parseARN(arn: string) {
  const match = arn.match(arnRe);
  if (!match) {
    throw new Error(`Invalid ARN: ${arn}`);
  }
  const bucketId = match[2];
  const fileName = match[3];
  return { bucketId, fileName };
}

function constructARN(bucketId: string, fileName: string) {
  return `arn:aws:s3:${AWS_REGION}:${bucketId}:${fileName}`;
}

export function getDefaultBucket(): string {
  if (!process.env.S3_DEFAULT_BUCKET_ID) {
    throw new Error('S3_DEFAULT_BUCKET_ID not set');
  }
  return process.env.S3_DEFAULT_BUCKET_ID;
}

export function isS3Resource(urn: string) {
  return urn.startsWith('arn:aws:s3:');
}

function fileName2ContentType(fileName: string): string {
  const ext = path.extname(fileName);
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpeg';
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }//
}