import dayjs from 'dayjs';
import { getDurationBetweenDatesYYYYMMDD } from '../../../frontendlib/utils/getDurationBetweenDates';
import renderView from '~/gen/templated-views';
import primitives from '../primitives';
import {
  kickoffLockingFromWorkflow,
  extractContextId as prepare /* prepare */,
  dbLoadDataTree /* Loads object tree */,
  createOutputFolderName /* Generates an output folder name */,
  copyAttachments /* Copy attachments from gridfs (or other storage) to S3 */,
  qrGenerate /* Generate QR code view */,
  finReportGenerate /* Financial report generation */,
  blockchainLock /* Create lock in Blockchain and create blockchain manifest */,
  dbUpdateFinal /* Update context object with QR and BC fields */,
} from '@carbon-mint/qrlib';
import { pipe, taplog as log, IWorkflowStepArg } from '@carbon-mint/qrlib/build/main/lib/util/pipe';
const fs = require('fs');

import { Coordinate } from '~/utils/coordinatesFormatter';
import { Event } from '~/backendlib/types';
import { getDetailsConvertedToModalJson } from '~/backendlib/util/getDetailsConvertedToModalJson';
import { getHtmlFoEvent } from '~/backendlib/util/getHtmlFoEvent';
import { getAllMarkersForAllImageUrlsInObject } from '~/frontendlib/utils/getAllMarkersForAllImageUrlsInObject';
import { getCertificates } from '~/backendlib/util/getCertificates';
import { get, has } from 'lodash';
import { getSchemes } from '~/backendlib/util/getSchemes';
import { getOwnershipStatus } from '~/backendlib/util/getOwnershipStatus';
import { getModel } from '~/backendlib/db/adapter';
import { getMapCoordinatesFromString } from '~/backendlib/util/getMapCoordinatesFromString';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { State } from '~/backendlib/workflow/types';
import { qrSaveLinkOnContext } from '../qrSaveLinkOnContext';
import { getFormattedAndFilteredEventsForPipeline } from '~/backendlib/util/getFormattedAndFilteredEventsForPipeline';
import { getObjectWithFormattedDates } from '~/backendlib/util/getObjectWithFormattedDates';
import { getClientLogo } from 'backendlib/util/getClientLogo';
import { getHarvestedEventTime } from '~/backendlib/util/getHarvestedEventTime';
const OSPModelApi = getModel('/farmbook/organicsystemplan');
const CollectiveApi = getModel('/farmbook/collective');
import { model2collection } from '~/backendlib/db/dbviews/util';

const lockingPipeline = pipe(
  log('[generateQr]', 'Preparing...'),
  prepare,
  log('[generateQr]', 'entering dbLoadDataTree'),
  dbLoadDataTree,
  createOutputFolderName,
  log('[generateQr]', 'entering copyAttachments'),
  copyAttachments,
  log('[generateQr]', 'entering transform json'),
  transformTCJson,
  log('[generateQr]', 'entering qrGenerate'),
  qrGenerate,
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

function historyStateLabel(state: State) {
  if (!state) {
    return 'Not submitted';
  }
  switch (state.name) {
    case 'validated':
      return 'Validated';
    case 'validationFailed':
      return 'Validation Failed';
    case 'reviewFailed':
      return 'Review Failed';
    case 'waitingForReview':
      return 'Submitted for Review';
    case 'waitingForValidation':
      return 'Review completed, Submitted for Validation';
    case 'editable':
      return 'Created on';
    default:
      return state.name;
  }
}

function makeStateArr(node: State | undefined): State[] {
  if (!node) {
    return [];
  }
  if (!node.history) {
    return [node];
  }
  return [node, ...makeStateArr(node.history?.previousState)];
}

/** */
export async function transformTCJson(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const {
    domainContextTree: collective,
    domainObjectTree: transactioncertificate,
    domainObjectRelatedObjects: {
      '/farmbook/certificationbody': [certificationbody]
    }
  } = x.value;

  const samplings = await Promise.all(collective.samplingDetails
    .filter((sd: any) => sd.aggregationPlan.id === transactioncertificate.aggregationPlan.id)
    .map(async (sd: any, index: any, arr: any) => ({
      ...sd,
      isFirst: index === 0,
      notFirst: index !== 0,
      html: await getHtmlFoEvent({
        eventId: index.toString(),
        eventName: sd.schemaName,
        eventData: sd,
      })
    })));

  const ngmoTest = await Promise.all(collective.ngmoTestRecords.filter((testRecord: any) => {
    return transactioncertificate.ngmoRecords.some((ngmoRecord: any) => ngmoRecord.name === testRecord.sampleId);
  }).map(async (ngmo: any, index: number) => ({
    ...ngmo,
    isFirst: index === 0,
    notFirst: index !== 0,
    html: await getHtmlFoEvent({
      eventId: index.toString(),
      eventName: ngmo.schemaName,
      eventData: ngmo,
    })
  })));
  const aggregationPlan = collective.aggregationPlanDetails.filter((agd: any) => agd._id.toString() === transactioncertificate.aggregationPlan.id)
  const aggregationPlanFinal = await Promise.all(aggregationPlan.map(async (ap: any, index: number) => ({
    ...aggregationPlan[0],
    isFirst: index === 0,
    notFirst: index !== 0,
    html: await getHtmlFoEvent({
      eventId: ap._id.toString(),
      eventName: ap.schemaName,
      eventData: ap,
    })
  })))

  const harvestUpdateDetails = await Promise.all(collective.harvestUpdateDetails.filter((hu: any) => hu._id.toString() === aggregationPlan[0].hu.id).map(async (hud: any, index: number) => {
    return {
      ...hud,
      isFirst: index === 0,
      notFirst: index !== 0,
      html: await getHtmlFoEvent({
        eventId: index.toString(),
        eventName: hud.schemaName,
        eventData: hud
      })
    }
  }))
  const yearToMatch = transactioncertificate.issuedDate.substring(0, 4);
  const cosp = await OSPModelApi.aggregate([{ $match: { ospYear: yearToMatch } }])
  const cospFinal = await Promise.all(
    cosp.map(async (cos: any, index: number) => {
      return {
        ...cos,
        isFirst: index === 0,
        notFirst: index !== 0,
        html: await getHtmlFoEvent({
          eventId: index.toString(),
          eventName: 'organicSystemPlan',
          eventData: cos
        })
      }
    }))
  const farmerCollectiveData = await CollectiveApi.aggregate(
    [{ $match: { _id: collective._id } },
    { $addFields: { collectiveId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'collectiveId',
        foreignField: 'collectives',
        as: 'farmers',
        pipeline: [
          {
            $match: {
              osps: { $exists: true }
            },
          },
        ],
      }
    },
    {
      $project: {
        farmers: { personalDetails: 1, operatorDetails: 1, osps: 1, inspectionDetails: 1 },
      }
    }
    ]
  )

  const fosp = farmerCollectiveData.flatMap((item: any) =>
    item.farmers
      .filter((i: any) => i.osps)
      .flatMap((f: any) =>
        f.osps
          .filter((o: any) => o.year === parseInt(yearToMatch)) // Filter OSPs by the year condition
          .map((o: any) => ({
            ...o,
            personalDetails: f.personalDetails,
            operatorDetails: f.operatorDetails,
          }))
      )
  );

  const fospFinal = await Promise.all(
    fosp.map(async (fos: any, index: number) => {
      return {
        ...fos,
        isFirst: index === 0,
        notFirst: index !== 0,
        html: await getHtmlFoEvent({
          eventId: index.toString(),
          eventName: 'nested_farmerosp',
          eventData: fos,

        })
      }
    }))



  const historyStates = makeStateArr(x.ctx.wf?.state).filter((item: any) => item.name !== 'start');
  const validationHistory: any[] = [];
  // add the current state to history
  validationHistory.push({
    username: x.ctx.session.name || x.ctx.session.email,
    status: 'Validated',
    dateTime: dayjs().format('DD/MM/YYYY'),
  });
  await Promise.all(
    historyStates.map((historyItem: State) => {
      validationHistory.push({
        username:
          historyItem?.data?.event?.userSession.name || historyItem?.data?.event?.userSession.email,
        status: historyStateLabel(historyItem),
        dateTime: dayjs(historyItem?.data?.event?.ts).format('DD/MM/YYYY'),
      });
    }),
  );

  const data = {
    collective: {
      ...collective,
      schemes: await getSchemes(collective?.schemes),
    },
    currentTCStatus: "Validated",
    transactioncertificate,
    samplings,
    samplingsStringified: JSON.stringify(samplings),
    ngmoTest,
    ngmoTestStringified: JSON.stringify(ngmoTest),
    aggregationPlan: aggregationPlanFinal,
    aggregationPlanStringified: JSON.stringify(aggregationPlanFinal),
    harvestUpdateDetails,
    harvestUpdateDetailsStringified: JSON.stringify(harvestUpdateDetails),
    cosp: cospFinal,
    cospStringified: JSON.stringify(cospFinal),
    fosp: fospFinal,
    fospStringified: JSON.stringify(fospFinal),
    transactionHash: x.value?.blockchainData?.transactionHash,
    blockHash: x.value?.blockchainData?.blockHash,
    blockChainTimestamp: '', //json?.blockchainData?,
    blockchainLink: './blockchain-manifest.json', //json.blockchainRecordUrl, //json?.blockchainData?.transactionHash,
    poweredBy: 'Polygon', //json?.blockchainData?.transactionHash,
    certificates: [
      {
        key: 'Operator',
        value: getCertificates(collective?.documents),
      }
    ],
    genericHardCodedValidationLCHtml: getValidationLifeCycleEventsHtml(validationHistory),
    ...getClientLogo(),
  };

  return {
    ...x,
    value: {
      ...(x.value || {}),
      QRInput: {
        ...data,
        mapkey: process.env.GOOGLE_MAPS_KEY
      },
    },
  };
}



async function qrRenderForTransactionCertificate(domainSchemaId: string, mustacheData: any): Promise<string> {
  return renderView('add_collectivetransactioncert')('qr')(mustacheData);
}

const locker = kickoffLockingFromWorkflow(lockingPipeline, {
  ...primitives,
  qrRender: qrRenderForTransactionCertificate,
});

export default locker;
