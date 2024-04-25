import moment from 'moment';
import dayjs from 'dayjs';
import { getDurationBetweenDatesYYYYMMDD } from '../../../frontendlib/utils/getDurationBetweenDates';
import renderView from '~/gen/templated-views';
import primitives from '../primitives';
import { addOrdinalSuffix } from '~/utils/addOrdinalSuffix';
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
import { Coordinate } from '~/utils/coordinatesFormatter';
import { Event } from '~/backendlib/types';
import { getDetailsConvertedToModalJson } from '~/backendlib/util/getDetailsConvertedToModalJson';
import { getHtmlFoEvent } from '~/backendlib/util/getHtmlFoEvent';
import { getAllMarkersForAllImageUrlsInObject } from '~/frontendlib/utils/getAllMarkersForAllImageUrlsInObject';
import { getCertificates } from '~/backendlib/util/getCertificates';
import { get } from 'lodash';
import { getSchemes } from '~/backendlib/util/getSchemes';
import { getOwnershipStatus } from '~/backendlib/util/getOwnershipStatus';
import { getModel } from '~/backendlib/db/adapter';
import { getMapCoordinatesFromString } from '~/backendlib/util/getMapCoordinatesFromString';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { getFormattedAndFilteredEventsForPipeline } from '~/backendlib/util/getFormattedAndFilteredEventsForPipeline';
import { getHarvestedEventTime } from '~/backendlib/util/getHarvestedEventTime';
import { getClientLogo } from '~/backendlib/util/getClientLogo';
import { isValidEvent } from '~/backendlib/util/isValidEvent';
import { getTotalHarvestYield } from '~/backendlib/util/getTotalHarvestYield';
import { getObjectWithFormattedDates } from '~/backendlib/util/getObjectWithFormattedDates';
import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { getValidationStates } from '~/backendlib/util/getValidationStates';
import { qrSaveLinkOnContext } from '../qrSaveLinkOnContext';
import { getValidationLCHtmlForEntities } from '~/backendlib/helper/lockpipeline/getValidationLCHtmlForEntities';
const FarmerModelApi = getModel('/farmbook/farmer');

const lockingPipeline = pipe(
  // dumpEntrypoint,
  log('[generateQr]', 'Preparing... Aqua'),
  prepare,
  log('[generateQr]', 'entering dbLoadDataTree'),
  dbLoadDataTree,
  log('[generateQr]', 'entering lockPastEvents'),
  lockPastEvents,
  createOutputFolderName,
  log('[generateQr]', 'entering copyAttachments'),
  copyAttachments,
  log('[generateQr]', 'entering transform json'),
  transformAquaJson,
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

/** */
export async function transformAquaJson(ctx: any): Promise<IWorkflowStepArg> {
  const {
    domainContextTree: aquacrop,
    domainObjectTree: currentEvent,
    domainContextRelatedObjects: {
      '/farmbook/landparcel': [landParcel],
      '/farmbook/field': [field],
      '/farmbook/collective': [collective],
      '/farmbook/productionsystem': [productionSystem],
    },
    eventList,
  } = ctx.value;

  let validationWorkflowId = currentEvent?.validationWorkflowId ?? '';
  const farmer = aquacrop?.farmer?.id ? await FarmerModelApi.get(aquacrop?.farmer?.id) : {};

  const landParcelMap = getMapCoordinatesFromString(landParcel.map ?? '').map((coord) => ({
    ...coord,
    strokeColor: '#7fff00',
    strokeOpacity: 1,
    strokeWeight: 4,
  }));

  const fieldParcelMap = getMapCoordinatesFromString(field.map ?? '').map((coord) => ({
    ...coord,
    fillColor: 'blue',
    strokeColor: 'blue',
  }));

  const productionSystemFieldParcelMap = getMapCoordinatesFromString(
    get(productionSystem, 'field.map', ''),
  ).map((coord) => ({
    ...coord,
    fillColor: 'blue',
    strokeColor: 'blue',
  }));

  const events = await getFormattedAndFilteredEventsForPipeline(currentEvent, eventList);

  const eventsFinal = await Promise.all(
    events.map(async (event: any) => ({
      _id: event._id,
      html: await getHtmlFoEvent({
        eventId: event._id,
        eventName: event.schemaName,
        eventData: event.fullDetails,
      }),
      nestedCoordinates: [landParcelMap, fieldParcelMap],
      markers: await getAllMarkersForAllImageUrlsInObject(event),
    })),
  );

  const data = {
    currentEvent: {
      ...getObjectWithFormattedDates(currentEvent, ['details.startDate']),
      status: 'Validated',
    },
    collective: {
      ...collective,
      schemes: await getSchemes(collective?.schemes),
    },
    calculatedAreaInAcres: aquacrop?.field?.calculatedAreaInAcres,
    totalYield: getTotalHarvestYield(eventList),
    farmer: {
      ...farmer,
      name: farmer?.personalDetails?.firstName + ' ' + farmer?.personalDetails?.lastName,
      id: farmer?.operatorDetails?.farmerID ?? '',
      exp: farmer?.farmingExperience?.totalFarmingExperienceYears ?? '0',
      organicFarmingExp: farmer?.farmingExperience?.organicFarmingExperienceYears ?? '0',
      location: farmer?.personalDetails?.address?.village ?? '',
    },
    transactionHash: ctx.value?.blockchainData?.transactionHash,
    blockHash: ctx.value?.blockchainData?.blockHash,
    blockChainTimestamp: '', //json?.blockchainData?,
    blockchainLink: './blockchain-manifest.json', //json.blockchainRecordUrl, //json?.blockchainData?.transactionHash,
    poweredBy: 'Polygon', //json?.blockchainData?.transactionHash,
    certificates: [
      {
        key: 'Aqua Crop',
        value: getCertificates(aquacrop?.documents),
      },
      {
        key: 'Land Parcel',
        value: getCertificates(landParcel?.documents),
      },
      {
        key: 'Farmer',
        value: getCertificates(farmer?.documents),
      },
      {
        key: 'Operator',
        value: getCertificates(collective?.documents),
      },
    ],
    landParcel: {
      ...landParcel,
      owner:
        (landParcel?.landOwner?.firstName || '') + '' + (landParcel?.landOwner?.lastName || ''),
      schemes: await getSchemes(landParcel?.schemes),
      ownershipStatus: await getOwnershipStatus({
        farmerId: farmer?._id?.toString(),
        landParcelId: landParcel?._id?.toString(),
      }),
    },
    productionSystem,
    productionSystemFieldParcelMap: JSON.stringify([productionSystemFieldParcelMap]),
    ...getClientLogo(),
  };

  const validationLCHtml = {
    currentEvent: getValidationLifeCycleEventsHtml(await getValidationStates(ctx)),
    ...(await getValidationLCHtmlForEntities({ landParcel, farmer, collective })),
  };

  const logo = process.env.TENANT_NAME;
  return {
    ...ctx,
    value: {
      ...(ctx.value || {}),
      QRInput: {
        ...data,
        mapkey: process.env.GOOGLE_MAPS_KEY,
        logo,
        field,
        aquacrop,
        events,
        map: JSON.stringify([landParcelMap, fieldParcelMap]),
        eventsStringified: JSON.stringify(eventsFinal),
        cropHarvestedTime: getHarvestedEventTime(currentEvent, events),
        validationLCHtml,
      },
    },
  };
}

async function qrRenderForAqua(domainSchemaId: string, mustacheData: any): Promise<string> {
  return renderView('add_aquacrop')('qr')(mustacheData);
}

const locker = kickoffLockingFromWorkflow(lockingPipeline, {
  ...primitives,
  qrRender: qrRenderForAqua,
});

export default locker;
