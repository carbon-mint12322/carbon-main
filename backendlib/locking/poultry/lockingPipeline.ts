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
import { get, has } from 'lodash';
import { getSchemes } from '~/backendlib/util/getSchemes';
import { getOwnershipStatus } from '~/backendlib/util/getOwnershipStatus';
import { getModel } from '~/backendlib/db/adapter';
import { getMapCoordinatesFromString } from '~/backendlib/util/getMapCoordinatesFromString';
import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { qrSaveLinkOnContext } from '../qrSaveLinkOnContext';
import { getFormattedAndFilteredEventsForPipeline } from '~/backendlib/util/getFormattedAndFilteredEventsForPipeline';
import { getObjectWithFormattedDates } from '~/backendlib/util/getObjectWithFormattedDates';
import { getClientLogo } from 'backendlib/util/getClientLogo';
import { getHarvestedEventTime } from '~/backendlib/util/getHarvestedEventTime';
import { getValidationLCHtmlForEntities } from '~/backendlib/helper/lockpipeline/getValidationLCHtmlForEntities';
import { getValidationStates } from '~/backendlib/util/getValidationStates';
import { processEvidences } from '~/backendlib/util/getEventEvidences';
const FarmerModelApi = getModel('/farmbook/farmer');

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
  transformPoultryJson,
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
export async function transformPoultryJson(x: IWorkflowStepArg): Promise<IWorkflowStepArg> {
  const {
    domainContextTree: poultry,
    domainObjectTree: currentEvent,
    domainContextRelatedObjects: {
      '/farmbook/landparcel': [landParcel],
      '/farmbook/field': [field],
      '/farmbook/collective': [collective],
      '/farmbook/productionsystem': [productionSystem],
      '/farmbook/farmer': [farmer],
    },
    eventList,
  } = x.value;

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

  //Dummy object for claims and certifications

  const claims = {};
  const certifications = {};

  const data = {
    currentEvent: {
      ...getObjectWithFormattedDates(currentEvent, ['details.startDate']),
      status: 'Validated',
    },
    chickPlacementEvent: getChickPlacementEvent(eventList),
    collective: {
      ...collective,
      schemes: await getSchemes(collective?.schemes),
    },
    farmer: {
      ...farmer,
      name: farmer?.personalDetails?.firstName + ' ' + farmer?.personalDetails?.lastName,
      id: farmer?.operatorDetails?.farmerID ?? '',
      exp: farmer?.farmingExperience?.totalFarmingExperienceYears ?? '0',
      organicFarmingExp: farmer?.farmingExperience?.organicFarmingExperienceYears ?? '0',
      location: farmer?.personalDetails?.address?.village ?? '' + ',' + farmer?.personalDetails?.address?.state ?? '',
    },
    events,
    transactionHash: x.value?.blockchainData?.transactionHash,
    blockHash: x.value?.blockchainData?.blockHash,
    blockChainTimestamp: '', //json?.blockchainData?,
    blockchainLink: './blockchain-manifest.json', //json.blockchainRecordUrl, //json?.blockchainData?.transactionHash,
    poweredBy: 'Polygon', //json?.blockchainData?.transactionHash,
    certificates: [
      {
        key: 'Poultry',
        value: getCertificates(poultry?.documents),
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
    evidences: {},
    claims,
    certifications,
    productionSystem,
    productionSystemFieldParcelMap: JSON.stringify([productionSystemFieldParcelMap]),
    ...getClientLogo(),
  };

  data.events = await Promise.all(data.events.map(async (event: any) => ({
    ...event,
    markers: await getAllMarkersForAllImageUrlsInObject(event),
    evidences: event.fullDetails.evidences?.map((ev: any) => {
      return {
        url: ev
      }
    })
  })))

  let globalIndex = 0;

  data.evidences = processEvidences(data.events, globalIndex,'',landParcelMap, fieldParcelMap)

  const validationLCHtml = {
    currentEvent: getValidationLifeCycleEventsHtml(await getValidationStates(x)),
    ...(await getValidationLCHtmlForEntities({ landParcel, farmer, collective, poultry })),
  };

  return {
    ...x,
    value: {
      ...(x.value || {}),
      QRInput: {
        ...data,
        mapkey: process.env.GOOGLE_MAPS_KEY,
        field,
        poultry,
        map: JSON.stringify([landParcelMap, fieldParcelMap]),
        eventsStringified: JSON.stringify(eventsFinal),
        evidencesStringified: JSON.stringify(data.evidences),
        isEvidence: Object.keys(data.evidences).length > 0 ? true : false,
        noEvidence: Object.keys(data.evidences).length < 0 ? true : false,
        cropHarvestedTime: getHarvestedEventTime(currentEvent, events),
        validationLCHtml,
      },
    },
  };
}

/** */
function getChickPlacementEvent(events: any[]): Record<string, any> {
  //
  const event = events.find((event) => event.name === 'poultryChicksPlacement');

  return getObjectWithFormattedDates(event, ['details.placementDate']);
}

async function qrRenderForPoultry(domainSchemaId: string, mustacheData: any): Promise<string> {
  return renderView('add_poultry')('qr')(mustacheData);
}

const locker = kickoffLockingFromWorkflow(lockingPipeline, {
  ...primitives,
  qrRender: qrRenderForPoultry,
});

export default locker;
