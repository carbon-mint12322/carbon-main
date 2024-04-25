import type { PrimitiveFunctions } from '@carbon-mint/qrlib/build/main/lib/types/primitives-types';

import getSchema from './getSchema';
import getModel from './getModel';
import readAttachment from './readAttachment';
import writeS3File from './writeS3File';
import bcCalcHash from './bcCalcHash';
import bcSerializePayload from './bcSerializePayload';
import qrRender from './qrRender';
import createBlockchainRecord from './createBlockchainRecord';
import getBlockchainRecordUrl from './getBlockchainRecordUrl';
import getAppName from './getAppName';
import finReportRender from './finReportRender';
import connectDB from './connectDB';

const primitives: PrimitiveFunctions = {
  bcSerializePayload,
  bcCalcHash,
  createBlockchainRecord,
  finReportRender,
  getAppName,
  getBlockchainRecordUrl,
  getModel,
  getSchema,
  qrRender,
  readAttachment,
  writeS3File,
  connectDB
};

export default primitives;

/*
import { calcHash, serializePayload } from '~/smart-contracts/src/util';
import { createRecord as createBlockchainRecord } from '~/smart-contracts/src/EvLockerApi';
import { generateQrCode } from './qr-create';
import { writePublicFile as s3WritePublicFile } from '../s3';
import { UserSession, WorkflowContext } from '../workflow/types';
import { getModel } from '../db/adapter';

const splitSchemaId = (s: string) => s.split('/');
const getSchemaFromName = flow(splitSchemaId, last, getReffreeSchema);
*/
