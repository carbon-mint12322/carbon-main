/* eslint-disable no-async-promise-executor */
import { GridFSBucket, MongoClient } from 'mongodb';
import { Readable } from 'stream';

const TENANT_NAME = process.env.TENANT_NAME;
const BASE_URL = process.env.SERVER_URL;
const DATABASE_URL = process.env.DATABASE_URL;

/**
 *
 * @param fileType string
 * @returns fileName string
 */
export const newId = (fileType: string) => {
  let _base_ = new Date().getTime();
  return `${fileType}-${_base_++}-`;
};

/**
 *
 * @param file UploadFileBufferToGridFs
 * @returns gridFsFileID string
 */
export const fileId = (file: UploadFileBufferToGridFs) =>
  `/gridfs:${file?.bucketName}/${file?.filename}`;

/**
 *
 * @param file UploadFileBufferToGridFs
 * @returns filePublicLink string
 */
export const mongoFilePublicLink = (file: UploadFileBufferToGridFs) =>
  `${BASE_URL}/api/file/public?id=${fileId(file)}`;

/**
 *
 * @param file UploadFileBufferToGridFs
 * @returns filePrivateLink string
 */
export const mongoFilePrivateLink = (file: UploadFileBufferToGridFs) =>
  `${BASE_URL}/api/file/public?id=${fileId(file)}`;

/**
 *
 * @param file UploadFileBufferToGridFs
 * @returns fileQRLink string
 */
export const mongoFileQRLink = (file: UploadFileBufferToGridFs) =>
  `${BASE_URL}/api/qr?id=${fileId(file)}`;

export const connect = async () => {
  const client = new MongoClient(DATABASE_URL || '');
  await client.connect();
  const db = client.db();
  return db;
};

/**
 * @param binary Buffer
 * @returns readableInstanceStream Readable
 */
export const bufferToStream = async (binary: Buffer): Promise<Readable> => {
  const readableInstanceStream = await new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });
  return readableInstanceStream;
};

export interface UploadFileBufferToGridFs {
  _id: any;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  filename: string;
  bucketName: string;
  metadata: any;
}

export interface GridFsObject {
  _id: any;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  metadata: any;
}

/**
 *
 * @param content Buffer
 * @param fieldName string
 * @param filename string
 * @param metadata { [key: string]: any } | undefined
 * @returns UploadFileBufferToGridFs
 */
export const uploadFileBufferToGridFs = async (
  content: Buffer,
  fieldName: string,
  filename: string,
  metadata?: { [key: string]: any } | undefined,
  bucketName?: string,
): Promise<UploadFileBufferToGridFs> =>
  new Promise(async (resolve, reject) => {
    const db = await connect();
    const _bucketName = bucketName || TENANT_NAME || ' ';
    try {
      const bucket = new GridFSBucket(db, {
        bucketName: _bucketName,
      });

      console.log({ bucket })


      const readStream = await bufferToStream(content);
      const uniqueFn = newId(fieldName) + '-' + filename;

      const mongoStream = bucket.openUploadStream(uniqueFn, {
        chunkSizeBytes: 1048576,
        metadata: metadata || {},
      });

      readStream.pipe(mongoStream);

      mongoStream.on('finish', (gridFsObj: GridFsObject) => {
        resolve({
          ...gridFsObj,
          filename: uniqueFn,
          bucketName: _bucketName,
        });
      });
    } catch (err) {
      reject(err);
    }
  });

/**
 *
 * @param content Buffer
 * @param fieldName string
 * @param filename string
 * @param metadata { [key: string]: any } | undefined
 * @returns UploadFileBufferToGridFs
 */
export const uploadContentToGridFs = async (
  content: any,
  fieldName: string,
  filename: string,
  metadata?: { [key: string]: any } | undefined,
  bucketName?: string,
): Promise<UploadFileBufferToGridFs> =>
  new Promise(async (resolve, reject) => {
    const db = await connect();
    const _bucketName = bucketName || TENANT_NAME || ' ';
    console.log({ _bucketName })

    try {
      const bucket = new GridFSBucket(db, {
        bucketName: _bucketName,
      });


      const uniqueFn = newId(fieldName) + '-' + filename;
      console.log({ uniqueFn })

      const mongoStream = bucket.openUploadStream(uniqueFn, {
        chunkSizeBytes: 1048576,
        metadata: metadata || {},
      });
      console.log({ content })

      mongoStream.write(content);
      mongoStream.end();

      mongoStream.on('finish', (gridFsObj: GridFsObject) => {
        resolve({
          ...gridFsObj,
          filename: uniqueFn,
          bucketName: _bucketName,
        });
      });
    } catch (err) {
      console.log('🚀 ~ file: file.ts:182 ~ newPromise ~ err:', err);

      reject(err);
    }
  });

export interface UploadDataUrlToGridFs {
  status: string;
  qr: string;
  date: string;
  publicLink: string;
  privateLink: string;
  metadata: any;
}

/**
 *
 * @param dataUrl string
 * @param name string
 * @returns UploadDataUrlToGridFs
 */
export const uploadDataUrlToGridFs = async (
  dataUrl: string,
  fieldName: string,
  extraMetadata: Object = {}
): Promise<UploadDataUrlToGridFs | null> => {
  if (dataUrl && fieldName) {
    //data:application/pdf;name=labreport.pdf;base64,
    const regex = /^data:(.+);name=(.+);base64,(.*)$/;
    const matches = dataUrl.match(regex);
    if (matches && matches.length > 0) {
      const contentType = matches[1];
      const filename = matches[2];
      const data = matches[3];
      const content = await Buffer.from(data, 'base64');

      const imageUploadResult = await uploadFileBufferToGridFs(content, fieldName, filename, {
        ...extraMetadata,
        contentType: contentType,
        originalFileName: filename,
        fieldName: fieldName,
      });

      return {
        status: 'ok',
        qr: mongoFileQRLink(imageUploadResult),
        date: new Date().toString(),
        publicLink: mongoFilePublicLink(imageUploadResult),
        privateLink: mongoFilePrivateLink(imageUploadResult),
        metadata: imageUploadResult.metadata,
      };
    }
  }
  return null;
};

/**
 *
 * @param jsonObj { [key: string]: any }
 * @returns jsonObj { [key: string]: any }
 */
export const uploadFormFile = async (jsonObj: any) =>
  new Promise(async (resolve, reject) => {
    try {
      const formData = JSON.parse(JSON.stringify(jsonObj));
      const formattedData = await Object.keys(formData)?.reduce(async (acc, field) => {
        const value = formData[field];
        const accData = await acc;

        if (typeof value === 'string' && value) {
          const data = await uploadDataUrlToGridFs(value, field);
          if (data) {
            return {
              ...accData,
              [field]: data.publicLink,
            };
          }
        }
        if (typeof value !== 'string' && value && typeof value === 'object' && !Array.isArray(value)) {
          const data: any = await uploadFormFile(value);
          return {
            ...accData,
            [field]: data,
          };
        }

        if (typeof value !== 'string' && typeof value === 'object' && Array.isArray(value)) {
          const data: any = await Promise.all(
            value.map((arrayValue) => uploadArrayFile(arrayValue, field)),
          );

          return {
            ...accData,
            [field]: data,
          };
        }

        return {
          ...accData,
          [field]: value,
        };
      }, Promise.resolve({}));

      resolve(formattedData);
    } catch (error) {
      reject(error);
    }
  });

export const uploadArrayFile = async (arrayData: any, field: string) =>
  new Promise(async (resolve, reject) => {
    try {
      if (typeof arrayData === 'string' && arrayData) {
        const data = await uploadDataUrlToGridFs(arrayData, field);
        if (data) {
          resolve(data?.publicLink || arrayData);
        }
      }

      if (
        typeof arrayData !== 'string' &&
        typeof arrayData === 'object' &&
        !Array.isArray(arrayData)
      ) {
        const data: any = await uploadFormFile(arrayData);
        resolve(data);
      }

      resolve(arrayData);
    } catch (error) {
      reject(error);
    }
  });
