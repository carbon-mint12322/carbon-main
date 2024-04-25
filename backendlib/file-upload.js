const { MongoClient } = require('mongodb');

import { GridFSBucket } from 'mongodb';
import { createReadStream } from 'fs';
import formidable from 'formidable';

const bucketName = process.env.TENANT_NAME;

export const connect = async () => {
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const db = client.db();
  return db;
};

const parseMultipart = async (req) =>
  new Promise((resolve, reject) =>
    formidable({ multiples: true }).parse(req, (err, fields, files) =>
      err ? reject({ err }) : resolve({ fields, files }),
    ),
  );

const upload = async (file, fileType, metadata) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        return reject('No file found');
      }
      const db = await connect();
      const bucket = new GridFSBucket(db, {
        bucketName,
      });
      const uniqueFn = newId(fileType) + '-' + file.originalFilename;
      console.log('uniqueFn is', uniqueFn);
      const uploadStream = bucket.openUploadStream(uniqueFn, {
        chunkSizeBytes: 1048576,
        metadata,
      });
      uploadStream.on('finish', (gridfsObj) => {
        console.log('--- DONE --', gridfsObj);
        resolve({
          ...gridfsObj,
          filename: uniqueFn,
          bucketName,
        });
      });
      uploadStream.on('error', (err) => {
        console.log('error', err);
        reject(err);
      });
      createReadStream(file.filepath).pipe(uploadStream);
    } catch (e) {
      console.log('ERROR IN UPLOAD', e);
    }
  });

const baseUrl = process.env.SERVER_URL;
const fileId = (file) => `/gridfs:${file.bucketName}/${file.filename}`;
const mongoFileLink = (file) => `${baseUrl}/api/file/public?id=${fileId(file)}`;

export const uploadFile = async (file, fileType, metadata = {}) => {
  const uploadResult = await upload(file, fileType, metadata);
  return mongoFileLink(uploadResult);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

let _base_ = new Date().getTime();
const newId = (fileType) => fileType + '-' + _base_++ + '-';
