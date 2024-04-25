import primitives from './primitives';
import {
  kickoffLockingFromWorkflow,
  extractContextId as prepare /* prepare */,
  dbLoadDataTree /* Loads object tree */,
  lockPastEvents /* Locks past event objects in the DB */,
  createOutputFolderName /* Generates an output folder name */,
  copyAttachments /* Copy attachments from gridfs (or other storage) to S3 */,
  qrGenerate /* Generate QR code view */,
  finReportGenerate /* Financial report generation */,
  blockchainLock /* Create lock in Blockchain and create blockchain manifest */,
  dbUpdateFinal /* Update context object with QR and BC fields */,
} from '@carbon-mint/qrlib';
import { pipe, taplog as log, IWorkflowStepArg } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
import transformJSON from '~/workflows/farmbook/functions/QRDataFormat';
import { qrSaveLinkOnContext } from './qrSaveLinkOnContext';
const fs = require('fs');

const lockingPipeline = pipe(
  // dumpEntrypoint,
  log('[generateQr]', 'Preparing...'),
  prepare,
  log('[generateQr]', 'entering dbLoadDataTree'),
  dbLoadDataTree,
  log('[generateQr]', 'entering lockPastEvents'),
  lockPastEvents,
  createOutputFolderName,
  log('[generateQr]', 'entering copyAttachments'),
  copyAttachments,
  log('[generateQr]', 'entering transform json'),
  transformJSON,
  log('[generateQr]', 'entering qrGenerate'),
  qrGenerate,
  log('[qrSaveLinkOnContext]', 'entering qrSaveLinkOnContext'),
  qrSaveLinkOnContext,
  log('[generateQr]', 'entering finReportGenerate'),
  finReportGenerate,
  log('[generateQr]', 'entering blockchainLock'),
  blockchainLock,
  log('[generateQr]', 'entering dbUpdateFinal'),
  dbUpdateFinal,
);

async function dumpEntrypoint(x: IWorkflowStepArg) {
  return Promise.reject('Aborting in dumpEntrypoint');
}

const locker = kickoffLockingFromWorkflow(lockingPipeline, primitives);

export default locker;
