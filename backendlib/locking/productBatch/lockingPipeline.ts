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

import lockPastEvents from './lockPastEvents';
import { getHtmlFoEvent } from '~/backendlib/util/getHtmlFoEvent';
import { getAllMarkersForAllImageUrlsInObject } from '~/frontendlib/utils/getAllMarkersForAllImageUrlsInObject';
import { getCertificates } from '~/backendlib/util/getCertificates';
import { getSchemes } from '~/backendlib/util/getSchemes';
import { getOwnershipStatus } from '~/backendlib/util/getOwnershipStatus';
import { getModel } from '~/backendlib/db/adapter';
import { getMapCoordinatesFromString } from '~/backendlib/util/getMapCoordinatesFromString';
import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { getValidationLCHtmlForEntities } from '~/backendlib/helper/lockpipeline/getValidationLCHtmlForEntities';
import { getValidationStates } from '~/backendlib/util/getValidationStates';
import { getClientLogo } from 'backendlib/util/getClientLogo';
import { formatName } from '~/utils/formatName';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const LandParcelModelApi = getModel('/farmbook/landparcel');
const FieldModelApi = getModel('/farmbook/field');
import { model2collection } from '~/backendlib/db/dbviews/util';
import { stringDateFormatter } from '~/utils/dateFormatter';

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
  transformJson,
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

/** */
export async function transformJson(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const {
    domainContextTree: collective,
    domainObjectTree: productbatch,
    domainObjectRelatedObjects: {
      '/farmbook/product': [product],
    },
    eventList,
  } = x.value;

  const events = await formatEvents(eventList);

  const eventsFinal = await Promise.all(
    events.map(async (event: any) => {
      const landParcel = await getLandParcelDetails(event.lpId);
      const landParcelMap = getMapCoordinatesFromString(landParcel.map ?? '').map((coord) => ({
        ...coord,
        strokeColor: '#7fff00',
        strokeOpacity: 1,
        strokeWeight: 4,
      }));
      const filterOPUnit = landParcel.outputProcessingUnits.filter(
        (item: any) => item._id.toString() === event.fullDetails.outputProcessingUnit.id,
      );
      const filterProcessingSystemField = landParcel.processingSystems.filter((item: any) => item._id.toString() === filterOPUnit[0].processingSystem)
      const fieldDetails = await FieldModelApi.aggregate([
        {
          $match: { _id: ObjectId(filterProcessingSystemField[0].field) }
        },
        {
          $project: {
            map: 1,
            _id: 1
          }
        }
      ])
      const fieldParcelMap = getMapCoordinatesFromString(fieldDetails[0].map ?? '').map((coord) => ({
        ...coord,
        fillColor: 'blue',
        strokeColor: 'blue',
      }));
      const landParcelFiltered = {
        name: landParcel.name,
        owner: landParcel.owner,
        ownershipStatus: landParcel.ownershipStatus,
        calculatedAreaInAcres: landParcel.calculatedAreaInAcres,
      };
      return {
        _id: event._id,
        html: await getHtmlFoEvent({
          eventId: event._id,
          eventName: event.schemaName,
          eventData: event.fullDetails,
        }),
        nestedCoordinates: [landParcelMap, fieldParcelMap],
        markers: await getAllMarkersForAllImageUrlsInObject(event),
        farmer: { ...landParcel.farmer[0], name: formatName(landParcel.farmer[0]?.personalDetails), location: landParcel.farmer[0]?.personalDetails?.address?.village ?? '' },
        processor: { ...landParcel.processor[0], name: formatName(landParcel.processor[0]?.personalDetails) },
        outputProcessingUnits: filterOPUnit[0],
        operator : landParcel.collective[0],
        landParcel : {...landParcelFiltered,
           owner: (landParcel?.landOwner?.firstName || '') + ' ' + (landParcel?.landOwner?.lastName || ''),
           ownershipStatus: await getOwnershipStatus({
                farmerId: landParcel.farmer[0]?._id?.toString(),
                landParcelId: landParcel?._id?.toString(),
           }),
        }
      };
    }),
  );

  const data = {
    currentBatchStatus: 'Validated',
    collective: {
      ...collective,
      schemes: await getSchemes(collective?.schemes),
    },
    product,
    transactionHash: x.value?.blockchainData?.transactionHash,
    blockHash: x.value?.blockchainData?.blockHash,
    blockChainTimestamp: '', //json?.blockchainData?,
    blockchainLink: './blockchain-manifest.json', //json.blockchainRecordUrl, //json?.blockchainData?.transactionHash,
    poweredBy: 'Polygon', //json?.blockchainData?.transactionHash,
    certificates: [
      {
        key: 'Product',
        value: getCertificates(product?.documents),
      },
      {
        key: 'Operator',
        value: getCertificates(collective?.documents),
      },
    ],
    ...getClientLogo()
  };

  const validationLCHtml = {
    currentEvent: getValidationLifeCycleEventsHtml(await getValidationStates(x)),
    ...(await getValidationLCHtmlForEntities({ product, collective })),
  };

  const dateFormattedProductBatch = { ...productbatch, startDate: stringDateFormatter(productbatch.startDate), endDate: stringDateFormatter(productbatch.endDate) }

  return {
    ...x,
    value: {
      ...(x.value || {}),
      QRInput: {
        ...data,
        mapkey: process.env.GOOGLE_MAPS_KEY,
        productbatch: dateFormattedProductBatch,
        events,
        eventsStringified: JSON.stringify(eventsFinal),
        validationLCHtml,
      },
    },
  };
}

/** */
async function formatEvents(events: any[]): Promise<any[]> {
  return events
    .filter((item: any) => item.category != 'Submission' && item.status != 'archived')
    .sort(
      (a: any, b: any) =>
        +new Date(
          b.details?.durationAndExpenses?.startDate ||
          b.details?.startDate ||
          b.details?.dateOfPurchase ||
          b.createdAt,
        ) -
        +new Date(
          a.details?.durationAndExpenses?.startDate ||
          a.details?.startDate ||
          a.details?.dateOfPurchase ||
          a.createdAt,
        ),
    )
    .map((event: any, index: number) => ({
      _id: event._id,
      name: event?.details?.name,
      createdAt: dayjs(event?.createdAt).format('DD MMM YYYY'),
      eventDate: event?.details?.durationAndExpenses?.startDate
        ? dayjs(event?.details?.durationAndExpenses?.startDate).format('DD MMM YYYY')
        : dayjs(event?.details?.startDate || event.details?.dateOfPurchase).format('DD MMM YYYY'),
      days: event?.details?.durationAndExpenses
        ? getDurationBetweenDatesYYYYMMDD(
          event?.details?.durationAndExpenses?.startDate,
          event?.details?.durationAndExpenses?.endDate,
        ) === 0
          ? 1
          : getDurationBetweenDatesYYYYMMDD(
            event?.details?.durationAndExpenses?.startDate,
            event?.details?.durationAndExpenses?.endDate,
          )
        : event?.details?.startDate
          ? getDurationBetweenDatesYYYYMMDD(event?.details?.startDate, event?.details?.endDate) === 0
            ? 1
            : getDurationBetweenDatesYYYYMMDD(event?.details?.startDate, event?.details?.endDate)
          : 1,
      description: event?.details?.otherRemarks,
      isFirst: index === 0,
      notFirst: index !== 0,
      schemaName: event.name,
      fullDetails: event?.details ?? {},
      lpId: event.landParcelId,
    }));
}

async function getLandParcelDetails(landParcelId: string) {
  const lp = await LandParcelModelApi.aggregate([
    { $match: { _id: ObjectId(landParcelId) } },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        as: 'landParcelFarmers',
        pipeline: [
          {
            $match: {
              active: true,
              $or: [
                {
                  "farmer": { "$exists": true }
                },
                {
                  "processor": { "$exists": false }
                }
              ]
            },
          },
        ],
      }
    },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        as: 'landParcelProcessors',
        pipeline: [
          {
            $match: { active: true, "processor": { "$exists": true } },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('processingsystems'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'processingSystems',
      },
    },
    { $addFields: { landParcelFarmer: { $arrayElemAt: ['$landParcelFarmers', 0] } } },
    { $addFields: { landParcelProcessor: { $arrayElemAt: ['$landParcelProcessors', 0] } } },
    { $addFields: { farmerObjectId: { $toObjectId: '$landParcelFarmer.farmer' } } },
    { $addFields: { processorObjectId: { $toObjectId: '$landParcelProcessor.processor' } } },
    { $addFields: { collectiveObjectId: { $toObjectId: '$collective' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'farmerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'farmer',
      },
    },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'processorObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'processor',
      },
    },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectiveObjectId',
        foreignField: '_id',
        as: 'collective',
      },
    },
    {
      $project: {
        landParcelId: 1,
        name: 1,
        owner: 1,
        ownershipStatus: 1,
        calculatedAreaInAcres: 1,
        map: 1,
        outputProcessingUnits: 1,
        status: 1,
        landOwner: 1,
        farmer: {
          _id: 1,
          personalDetails: {
            firstName: 1, lastName: 1,
            address: {
              village: 1
            }
          },
          personalOrgDetails: { identificationNumber: 1 },
          farmingExperience: {
            totalFarmingExperienceYears: 1,
            organicFarmingExperienceYears: 1,
          },
          operatorDetails: {
            farmerID: 1
          }
        },
        processor: {
          _id: 1,
          personalDetails: {
            firstName: 1, lastName: 1,
            address: {
              village: 1,
              state: 1,
              pincode: 1
            },
            primaryPhone: 1,
          },
          processingExperience: 1,
          dob: 1,
          gender: 1
        },
        processingSystems: {
          _id: 1, field: 1
        },
        collective: {
          name: 1,
          category: 1,
          email: 1,
          poc: 1,
          phone: 1,
          address: 1
        }
      }
    }
  ])
  return lp[0];
}

async function qrRenderForProductBatch(domainSchemaId: string, mustacheData: any): Promise<string> {
  return renderView('add_productBatch')('qr')(mustacheData);
}

const locker = kickoffLockingFromWorkflow(lockingPipeline, {
  ...primitives,
  qrRender: qrRenderForProductBatch,
});

export default locker;
