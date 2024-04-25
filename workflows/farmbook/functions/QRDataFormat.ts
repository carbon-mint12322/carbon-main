
import { getDurationBetweenDatesYYYYMMDD } from '../../../frontendlib/utils/getDurationBetweenDates';
import { stringDateFormatter } from '~/utils/dateFormatter';
import { get } from 'lodash';
import { getModel } from '~/backendlib/db/adapter';
import { getOwnershipStatus } from '~/backendlib/util/getOwnershipStatus';


import { getAllMarkersForAllImageUrlsInObject } from '~/frontendlib/utils/getAllMarkersForAllImageUrlsInObject';
import { getHtmlFoEvent } from '~/backendlib/util/getHtmlFoEvent';
import { getCertificates } from '~/backendlib/util/getCertificates';
import { getSchemes } from '~/backendlib/util/getSchemes';
import { getValidationLifeCycleEventsHtml } from '~/frontendlib/utils/getValidationLifeCycleEventsHtml';
import { getFormattedAndFilteredEventsForPipeline } from '~/backendlib/util/getFormattedAndFilteredEventsForPipeline';
const CropModelApi = getModel('/farmbook/crop');
const PlotModelApi = getModel('/farmbook/plot');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { getClientLogo } from 'backendlib/util/getClientLogo';
import { getHarvestedEventTime } from '~/backendlib/util/getHarvestedEventTime';
import { getTotalHarvestYield } from '~/backendlib/util/getTotalHarvestYield';
import { getValidationLCHtmlForEntities } from '~/backendlib/helper/lockpipeline/getValidationLCHtmlForEntities';
import { getValidationStates } from '~/backendlib/util/getValidationStates';
import { formatName } from '~/utils/formatName';
import { processEvidences } from '~/backendlib/util/getEventEvidences';

export default async function transformJSON(x: any) {
  const json = x.value;
  let crop = json.domainObjectTree?.cropId || {};
  let validationWorkflowId = json.domainObjectTree?.validationWorkflowId ?? '';
  let landparcel = json?.domainContextTree?.landParcel || {};
  let field = json?.domainContextTree?.field || {};
  let farmer = json?.domainContextTree?.farmer || {};
  let croppingSystem = json?.domainContextTree?.croppingSystem || {};
  let collective = json?.domainContextTree?.collective || {};
  let events = json?.eventList || [];
  const currentEvent = json?.domainObjectTree;
  const currentEventHarvestDate = get(currentEvent, 'details.durationAndExpenses.startDate');

  const plot = await PlotModelApi.aggregate([
    { $match: { _id: ObjectId(crop?.plot) } },
    {
      $project: {
        name: 1,
        map: 1,
        category: 1,
        area: 1,
        fbId: 1
      }
    }
  ])

  const landParcelMap = landparcel.map?.split(' ')?.map((item: any) => ({
    lat: parseFloat(item.split(',')[1]),
    lng: parseFloat(item.split(',')[0]),
    strokeColor: '#7fff00',
    strokeOpacity: 1,
    strokeWeight: 4,
  }));

  const fieldParcelMap = field.map?.split(' ')?.map((item: any) => ({
    lat: parseFloat(item.split(',')[1]),
    lng: parseFloat(item.split(',')[0]),
    fillColor: 'blue',
    strokeColor: 'blue',
  }));

  const plotMap = plot[0]?.map?.split(' ')?.map((item: any) => ({
    lat: parseFloat(item.split(',')[1]),
    lng: parseFloat(item.split(',')[0]),
    strokeColor: 'purple',
    fillColor: 'purple',
  }));

  //Dummy object for claims and certifications

  const claims = {};
  const certifications = {};

  var input = {
    currentEventStatus: 'Validated',
    cropName: crop?.name,
    cropNameImg: crop?.name.toLowerCase().replace(/ /g, '_'),
    climateScore: landparcel?.climateScore || 'NA',
    complianceScore: landparcel?.complianceScore || 'NA',
    seedSource: crop?.seedSource,
    seedVariety: crop?.seedVariety,
    sowingDate: stringDateFormatter(crop?.actualSowingDate),
    harvestDate: stringDateFormatter(currentEventHarvestDate),
    fieldSize: crop?.areaInAcres,
    cropValidationStatus: crop?.status,
    yield: get(currentEvent, 'details.harvestQuantity', 0),
    totalYield: getTotalHarvestYield(events),
    duration: getDurationBetweenDatesYYYYMMDD(crop?.actualSowingDate, currentEventHarvestDate),
    landparcelName: landparcel.name,
    landParcelValidationStatus: landparcel?.status,
    landParcelSchemes: await getSchemes(landparcel?.schemes),
    landOwner:
      (landparcel?.landOwner?.firstName || '') + '' + (landparcel?.landOwner?.lastName || ''),
    ownershipStatus: await getOwnershipStatus({
      farmerId: farmer?._id?.toString(),
      landParcelId: landparcel?._id?.toString(),
    }),
    landparcelArea: landparcel?.areaInAcres,
    events: getFormattedAndFilteredEventsForPipeline(currentEvent, events),
    farmerName: formatName(farmer?.personalDetails),
    farmerId: farmer?.operatorDetails?.farmerID,
    farmingExp: farmer?.farmingExperience?.totalFarmingExperienceYears ?? 0,
    farmerValidationStatus: farmer?.status,
    organicFarmingExp: farmer?.farmingExperience?.organicFarmingExperienceYears ?? 0,
    farmerLocation: farmer?.personalDetails?.address?.village,
    transactionHash: json?.blockchainData?.transactionHash,
    blockHash: json?.blockchainData?.blockHash,
    blockChainTimestamp: '', //json?.blockchainData?,
    blockchainLink: './blockchain-manifest.json', //json.blockchainRecordUrl, //json?.blockchainData?.transactionHash,
    poweredBy: 'Polygon', //json?.blockchainData?.transactionHash,
    mapkey: process.env.GOOGLE_MAPS_KEY,
    map: JSON.stringify([landParcelMap, fieldParcelMap, plotMap]),
    evidences: {},
    claims,
    certifications,
    collective: {
      ...collective,
      schemes: await getSchemes(collective?.schemes),
    },
    croppingSystem: await getCroppingSystemFormatted({ croppingSystem }),
    plot,
    certificates: [
      {
        key: 'Crop',
        value: getCertificates(crop?.documents),
      },
      {
        key: 'Land Parcel',
        value: getCertificates(landparcel?.documents),
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
    ...getClientLogo(),
  };

  input.events = await Promise.all(input.events.map(async (event: any) => ({
    ...event,
    markers: await getAllMarkersForAllImageUrlsInObject(event),
    evidences: Array.isArray(event.fullDetails?.evidences) // evidence won't be saved as undefined
      ? event.fullDetails.evidences.map((ev: any) => ({ url: ev }))
      : [],
  })))

  let globalIndex = 0;

  input.evidences = processEvidences(input.events, globalIndex, plotMap, landParcelMap, fieldParcelMap)

  const eventsFinal = await Promise.all(
    input.events.map(async (event: any) => ({
      _id: event._id,
      html: await getHtmlFoEvent({
        eventId: event._id,
        eventName: event.schemaName,
        eventData: event.fullDetails,
      }),
      nestedCoordinates: plotMap ? [landParcelMap, fieldParcelMap, plotMap] : [landParcelMap, fieldParcelMap],
      markers: await getAllMarkersForAllImageUrlsInObject(event),
    })),
  );

  const validationLCHtml = {
    currentEvent: getValidationLifeCycleEventsHtml(await getValidationStates(x)),
    ...(await getValidationLCHtmlForEntities({ landParcel: landparcel, farmer, collective, crop })),
  };

  return {
    ...x,
    value: {
      ...(x.value || {}),
      QRInput: {
        ...input,
        eventsStringified: JSON.stringify(eventsFinal),
        evidencesStringified: JSON.stringify(input.evidences),
        isEvidence: Object.keys(input.evidences).length > 0 ? true : false,
        noEvidence : Object.keys(input.evidences).length < 0 ? true : false,
        cropHarvestedTime: getHarvestedEventTime(currentEvent, input.events),
        validationLCHtml,
      },
    },
  };
}

/** */
async function getCroppingSystemFormatted({
  croppingSystem,
}: {
  croppingSystem: {
    _id?: string;
    category?: string;
    name?: string;
    field?: { _id?: string; fbId?: string };
    status?: string;
  };
}) {
  if (!croppingSystem._id) return {};

  const croppingSystemId = croppingSystem?._id?.toString() ?? '';
  const croppingSystemFieldId = croppingSystem.field?._id?.toString() ?? '';
  const croppingSystemFieldFbId = croppingSystem.field?.fbId ?? '';

  const crops: { category?: string; field?: { _id?: string; fbId?: string }; name?: string }[] =
    await CropModelApi.list({
      croppingSystem: croppingSystemId,
    });

  const getCropName = (category: string) => {
    return (
      crops.find((c) => c.category === category && c.field === croppingSystemFieldId)?.name ?? ''
    );
  };

  return [{
    name: croppingSystem.name,
    category: croppingSystem.category,
    fieldFbId: croppingSystemFieldFbId,
    mainCrop: getCropName('Main'),
    interCrop1: getCropName('Inter'),
    interCrop2: getCropName('Inter 2'),
    borderCrop: getCropName('Border'),
    coverCrop: getCropName('Cover'),
    status: croppingSystem?.status ?? '',
  }];
}
