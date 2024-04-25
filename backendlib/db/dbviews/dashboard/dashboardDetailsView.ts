const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import dayjs from 'dayjs';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

const EVENTS_SCHEMA_ID = model2schemaId('event');
const EventsApi = MongoAdapter.getModel(EVENTS_SCHEMA_ID);

const FIELD_SCHEMA_ID = model2schemaId('field');
const FieldApi = MongoAdapter.getModel(FIELD_SCHEMA_ID);

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

const PROCESSINGSYSTEM_SCHEMA_ID = model2schemaId('processingsystem');
const ProcessingSystemApi = MongoAdapter.getModel(PROCESSINGSYSTEM_SCHEMA_ID);

const PRODUCT_SCHEMA_ID = model2schemaId('product');
const ProductApi = MongoAdapter.getModel(PRODUCT_SCHEMA_ID);

const PRODUCTBATCH_SCHEMA_ID = model2schemaId('productbatch');
const ProductBatchApi = MongoAdapter.getModel(PRODUCTBATCH_SCHEMA_ID);

const PROCESSOR_SCHEMA_ID = model2schemaId('processor');
const ProcessorApi = MongoAdapter.getModel(PROCESSOR_SCHEMA_ID);

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);

const COLLECTIVE_SCHEMA_ID = model2schemaId('collective');
const CollectiveApi = MongoAdapter.getModel(COLLECTIVE_SCHEMA_ID);

const TASKS_SCHEMA_ID = model2schemaId('task');
const TaskApi = MongoAdapter.getModel(TASKS_SCHEMA_ID);

interface Query {
  geographicalDistributionContext?: string;
  geographicalDistributionSubType?: string;
  generalDistributionContext?: string;
  generalDistributionCropContext?: string;
  generalDistributionLandParcelContext?: string;
  generalDistributionFarmerContext?: string;
  generalDistributionTractorContext?: string;
  generalDistributionInsuranceContext?: string;
  yieldEstimatesContext?: string;
  yieldEstimatesSubType?: string;
  yieldEstimatesStartDate?: string;
  yieldEstimates30DayEndDate?: string;
  yieldEstimates60DayEndDate?: string;
  yieldEstimates90DayEndDate?: string;
  harvestHistoryContext?: string;
  harvestHistorySubType?: string;
  harvestHistoryStartDate?: string;
  harvestHistory30DayEndDate?: string;
  harvestHistory60DayEndDate?: string;
  harvestHistory90DayEndDate?: string;
  inputsUsageMetricsContext?: string;
  inputsUsageMetricsPeriodContext?: string;
  inputsUsageMetricsCropsContext?: string;
  inputsUsageMetricsInputsTypeContext?: string;
  operatorFilter?: string;
  geographicalDistributionCropType?: string;
  org?: string;
}

export const dashboardDetailsView = async (query: Query) => {
  try {
    const listCrops = (collective: any) =>
      CropApi.aggregate([
        { $match: { collective: JSON.parse(JSON.stringify(collective))._id.toString() } },
        { $addFields: { cropId: { $toString: '$_id' } } },
        { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
        {
          $lookup: {
            from: model2collection('fields'),
            localField: 'fieldObjectId',
            foreignField: '_id',
            as: 'fieldDetails',
          },
        },
        {
          $lookup: {
            from: model2collection('plans'),
            localField: 'cropId',
            foreignField: 'cropId',
            as: 'plans',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            croppingSystem: 1,
            areaInAcres: 1,
            estimatedYieldTonnes: 1,
            actualYieldTonnes: 1,
            estHarvestDate: 1,
            farmer: 1,
            landParcel: 1,
            field: 1,
            cropType: 1,
            seedVariety: 1,
            active: 1,
            plans: { events: { ccp: 1, eventStatus: 1, range: 1 } },
            fieldDetails: { _id: 1, map: 1, location: 1, fbId: 1, calculatedAreaInAcres: 1 },
          },
        },
      ]);
    const listFields = (filter = {}, options?: any) => FieldApi.list(filter, options);
    const listProcessors = (filter = {}, options?: any) => FarmerApi.list(filter, options);
    const listFarmers = (filter = {}, options?: any) => FarmerApi.list(filter, options);
    const listProcessingSystems = (filter = {}, options?: any) =>
      ProcessingSystemApi.list(filter, options);
    const listProducts = (filter = {}, options?: any) => ProductApi.list(filter, options);
    const listProductBatches = (filter = {}, options?: any) =>
      ProductBatchApi.list(filter, options);
    const listLandParcels = (filter = {}, options?: any) => LPApi.list(filter, options);
    const listTasks = (filter = {}, options?: any) => TaskApi.list(filter, options);
    const collective = await CollectiveApi.getByFilter({ slug: query?.org });
    const crops = await listCrops(collective);
    const events = await EventsApi.aggregate([
      { $match: { status: { $ne: 'archived' } } },
      { $addFields: { sortDate: { $toDate: '$createdAt' } } },
      { $sort: { sortDate: -1 } },
      { $limit: 5 },
      {
        $addFields: {
          createdById: {
            $toObjectId: '$createdBy',
          },
        },
      },
      {
        $lookup: {
          from: model2collection('users'),
          localField: 'createdById',
          foreignField: '_id',
          // pipeline: [{ $match: { active: true } }],
          as: 'users',
        },
      },
      { $addFields: { cropObjectId: { $toObjectId: '$cropId' } } },
      {
        $lookup: {
          from: model2collection('crops'),
          localField: 'cropObjectId',
          foreignField: '_id',
          as: 'crop',
        },
      },
      { $addFields: { cropItem: { $arrayElemAt: ['$crop', 0] } } },

      { $addFields: { poultryObjectId: { $toObjectId: '$poultryId' } } },
      { $addFields: { poultryBatchObjectId: { $toObjectId: '$poultrybatchId' } } },
      {
        $lookup: {
          from: model2collection('poultrybatches'),
          let: { poultryObjectId: "$poultryObjectId", poultryBatchObjectId: "$poultryBatchObjectId" },
          pipeline: [
            {
              $match:
                { active: true }
            },
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$_id", "$$poultryObjectId"] },
                    { $eq: ["$_id", "$$poultryBatchObjectId"] }
                  ]
                }
              }
            }
          ],
          as: 'poultryBatch',
        },
      },

      { $addFields: { aquacropObjectId: { $toObjectId: '$aquacropId' } } },
      {
        $lookup: {
          from: model2collection('aquacrops'),
          localField: 'aquacropObjectId',
          foreignField: '_id',
          as: 'aquacrop',
        },
      },

      { $addFields: { productionSystemObjectId: { $toObjectId: '$productionSystemId' } } },
      {
        $lookup: {
          from: model2collection('productionsystems'),
          localField: 'productionSystemObjectId',
          foreignField: '_id',
          as: 'productionSystem',
        },
      },
      { $addFields: { processingSystemObjectId: { $toObjectId: '$processingSystemId' } } },
      {
        $lookup: {
          from: model2collection('processingsystems'),
          localField: 'processingSystemObjectId',
          foreignField: '_id',
          as: 'processingSystem',
        },
      },

      { $addFields: { lpObjectId: { $toObjectId: '$landParcelId' } } },
      {
        $lookup: {
          from: model2collection('landparcels'),
          localField: 'lpObjectId',
          foreignField: '_id',
          as: 'landparcel',
        },
      },
      {
        $project: {
          category: 1,
          createdAt: 1,
          createdBy: 1,
          cropId: 1,
          landParcelId: 1,
          poultryId: 1,
          aquacropId: 1,
          productionSystemId: 1,
          processingSystemId: 1,
          location: { lat: 1, lng: 1 },
          name: 1,
          farmers: 1,
          processors: 1,
          products: 1,
          productbatches: 1,
          planId: 1,
          details: 1,
          _id: 1,
          crop: { name: 1, landParcel: 1, farmer: 1, field: 1 },
          poultryBatch: { batchIdName: 1, poultryType: 1, landParcel: 1, farmer: 1, field: 1 },
          aquacrop: { fbId: 1, cropType: 1, landParcel: 1, farmer: 1, field: 1 },
          productionSystem: { name: 1, category: 1, landParcel: 1, farmer: 1, field: 1 },
          processingSystem: { name: 1, category: 1, landParcel: 1, farmer: 1, field: 1 },
          landparcel: { name: 1, surveyNumber: 1 },
          users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        },
      },
    ]);
    const fields = await listFields(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        name: 1,
        map: 1,
        location: 1,
        active: 1,
      },
    );

    const farmers = await listFarmers(
      {
        collectives: JSON.parse(JSON.stringify(collective))._id.toString(),
        $or: [
          { type: { $exists: false } }, // Ignore the condition if type doesn't exist
          { type: 'Farmer' }, // Check if type exists and equals 'Farmer'
        ],
      },
      {
        _id: 1,
        personalDetails: { firstName: 1, lastName: 1 },
        personalOrgDetails: { orgName: 1, identificationNumber: 1 },
        farmingExperience: { totalFarmingExperienceYears: 1 },
        active: 1,
      },
    );

    const processingsystems = await listProcessingSystems(collective);

    const processors = await listProcessors(
      {
        collectives: JSON.parse(JSON.stringify(collective))._id.toString(),
        type: 'Processor',
      },
      {
        _id: 1,
        personalDetails: { firstName: 1, lastName: 1 },
        personalOrgDetails: { orgName: 1, identificationNumber: 1 },
        processingExperience: 1,
        active: 1,
      },
    );

    const products = await listProducts();
    const productbatches = await listProductBatches();

    const landParcels = await listLandParcels(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        name: 1,
        surveyNumber: 1,
        areaInAcres: 1,
        calculatedAreaInAcres: 1,
        climateScore: 1,
        complianceScore: 1,
        location: 1,
        field: 1,
        map: 1,
        active: 1,
        farmTractors: 1,
        solarDryerUnits: 1,
        compostingUnits: 1,
      },
    );

    const pendingTasks = await listTasks(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
        status: { $ne: 'Completed' },
      },
      { _id: 1 },
    );

    const getTotalActiveCrops = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          return {
            totalCrops: acc.totalCrops + 1,
          };
        }
        return { ...acc };
      },
      {
        totalCrops: 0,
      },
    );

    const getActiveCropTypes = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          const cropName = crop.name.toLowerCase(); // Consider case-insensitive comparison
          if (!acc.uniqueCropTypes.includes(cropName)) {
            acc.uniqueCropTypes.push(cropName);
            acc.totalActiveCropTypes += 1;
          }
        }
        return { ...acc };
      },
      {
        totalActiveCropTypes: 0,
        uniqueCropTypes: [],
      },
    );


    const getTotalActiveLandParcels = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (landParcel.active) {
          return {
            totalLandParcels: acc.totalLandParcels + 1,
          };
        }
        return { ...acc };
      },
      {
        totalLandParcels: 0,
      },
    );

    const getTotalActiveFarmers = JSON.parse(JSON.stringify(farmers))?.reduce(
      (acc: any, farmer: any) => {
        if (farmer.active) {
          return {
            totalFarmers: acc.totalFarmers + 1,
          };
        }
        return { ...acc };
      },
      {
        totalFarmers: 0,
      },
    );

    const getTotalActiveProcessingSystems = JSON.parse(JSON.stringify(processingsystems))?.reduce(
      (acc: any, processingsystem: any) => {
        if (processingsystem.active) {
          return {
            totalProcessingSystems: acc.totalProcessingSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalProcessingSystems: 0,
      },
    );

    const getTotalActiveProducts = JSON.parse(JSON.stringify(products))?.reduce(
      (acc: any, product: any) => {
        if (product.active) {
          return {
            totalProducts: acc.totalProducts + 1,
          };
        }
        return { ...acc };
      },
      {
        totalProducts: 0,
      },
    );

    const getTotalActiveProductBatches = JSON.parse(JSON.stringify(productbatches))?.reduce(
      (acc: any, productbatch: any) => {
        if (productbatch.active) {
          return {
            totalProductBatches: acc.totalProductBatches + 1,
          };
        }
        return { ...acc };
      },
      {
        totalProductBatches: 0,
      },
    );

    const getTotalActiveProcessors = JSON.parse(JSON.stringify(processors))?.reduce(
      (acc: any, processor: any) => {
        if (processor.active) {
          return {
            totalProcessors: acc.totalProcessors + 1,
          };
        }
        return { ...acc };
      },
      {
        totalProcessors: 0,
      },
    );

    const generalDistributionCropData = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          if (query?.generalDistributionCropContext === 'name') {
            return {
              generalCropDistribution: {
                ...acc.generalCropDistribution,
                [crop.name]: acc.generalCropDistribution?.[crop.name]
                  ? acc.generalCropDistribution?.[crop.name] + crop.areaInAcres
                  : crop.areaInAcres,
              },
            };
          }

          if (query?.generalDistributionCropContext === 'cropType') {
            return {
              generalCropDistribution: {
                ...acc.generalCropDistribution,
                [crop.cropType]: acc.generalCropDistribution?.[crop.cropType]
                  ? acc.generalCropDistribution?.[crop.cropType] + crop.areaInAcres
                  : crop.areaInAcres,
              },
            };
          }

          if (query?.generalDistributionCropContext === 'seedVariety') {
            return {
              generalCropDistribution: {
                ...acc.generalCropDistribution,
                [crop.seedVariety]: acc.generalCropDistribution?.[crop.seedVariety]
                  ? acc.generalCropDistribution?.[crop.seedVariety] + crop.areaInAcres
                  : crop.areaInAcres,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalCropDistribution: {},
      },
    );

    const generalDistributionLandparcelData = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (landParcel.active || query?.generalDistributionLandParcelContext === 'activeInactive') {
          if (query?.generalDistributionLandParcelContext === 'area') {
            return {
              generalLandParcelDistribution: {
                ...acc.generalLandParcelDistribution,
                ['< 1 Acre']:
                  +landParcel.areaInAcres < 1
                    ? (acc.generalLandParcelDistribution?.['< 1 Acre'] || 0) +
                    +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['< 1 Acre'] || 0,
                ['1 - 2 Acres']:
                  +landParcel.areaInAcres >= 1 && +landParcel.areaInAcres < 2
                    ? (acc.generalLandParcelDistribution?.['1 - 2 Acres'] || 0) +
                    +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['1 - 2 Acres'] || 0,
                ['2 - 5 Acres']:
                  +landParcel.areaInAcres >= 2 && +landParcel.areaInAcres <= 5
                    ? (acc.generalLandParcelDistribution?.['2 - 5 Acres'] || 0) +
                    +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['2 - 5 Acres'] || 0,
                ['> 5 Acres']:
                  +landParcel.areaInAcres > 5
                    ? (acc.generalLandParcelDistribution?.['> 5 Acres'] || 0) +
                    +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['> 5 Acres'] || 0,
              },
            };
          }
          if (query?.generalDistributionLandParcelContext === 'activeInactive') {
            return {
              generalLandParcelDistribution: {
                ...acc.generalLandParcelDistribution,
                ['Active']:
                  +landParcel.active === 1
                    ? (acc.generalLandParcelDistribution?.['Active'] || 0) + +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['Active'] || 0,
                ['Inactive']:
                  +landParcel.active === 0
                    ? (acc.generalLandParcelDistribution?.['Inactive'] || 0) +
                    +landParcel.areaInAcres
                    : acc.generalLandParcelDistribution?.['Inactive'] || 0,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalLandParcelDistribution: {},
      },
    );

    const generalDistributionFarmerData = JSON.parse(JSON.stringify(farmers))?.reduce(
      (acc: any, farmer: any) => {
        if (farmer.active || query?.generalDistributionFarmerContext === 'activeInactive') {
          if (query?.generalDistributionFarmerContext === 'activeInactive') {
            return {
              generalFarmerDistribution: {
                ...acc.generalFarmerDistribution,
                ['Active']: farmer.active
                  ? (acc.generalFarmerDistribution?.['Active'] || 0) + 1
                  : acc.generalFarmerDistribution?.['Active'] || 0,
                ['Inactive']: !farmer.active
                  ? (acc.generalFarmerDistribution?.['Inactive'] || 0) + 1
                  : acc.generalFarmerDistribution?.['Inactive'] || 0,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalFarmerDistribution: {},
      },
    );

    const generalDistributionTractorData = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (landParcel.active) {
          if (
            query?.generalDistributionTractorContext === 'brand' &&
            Array.isArray(landParcel?.farmTractors)
          ) {
            return {
              generalTractorDistribution: {
                ...acc.generalTractorDistribution,
                [landParcel?.farmTractors?.[0]?.tractorBrand]: acc.generalTractorDistribution?.[
                  landParcel?.farmTractors?.[0]?.tractorBrand
                ]
                  ? acc.generalTractorDistribution?.[landParcel?.farmTractors?.[0]?.tractorBrand] +
                  1
                  : 1,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalTractorDistribution: {},
      },
    );

    const generalDistributionInsuranceData = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          if (query?.generalDistributionInsuranceContext === 'provider' && crop?.insuranceDetails) {
            return {
              generalInsuranceDistribution: {
                ...acc.generalInsuranceDistribution,
                [crop?.insuranceDetails.provider]: acc.generalInsuranceDistribution?.[
                  crop?.insuranceDetails.provider
                ]
                  ? acc.generalInsuranceDistribution?.[crop?.insuranceDetails.provider] +
                  crop.areaInAcres
                  : crop.areaInAcres,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalInsuranceDistribution: {},
      },
    );
    //const GeneralDistributionFarmerData = farmers.reduce();

    const uniqueFields: any = [];
    const getTotalActiveCropsArea = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          if (crop?.fieldDetails?.[0]?._id && !uniqueFields.includes(crop.fieldDetails?.[0]?._id)) {
            uniqueFields.push(crop.fieldDetails[0]._id);
            return {
              totalActiveCropsArea: crop.fieldDetails?.[0]?.calculatedAreaInAcres
                ? acc.totalActiveCropsArea + parseFloat(crop.fieldDetails[0].calculatedAreaInAcres)
                : acc.totalActiveCropsArea,
            };
          }
        }
        return { ...acc };
      },
      {
        totalActiveCropsArea: 0,
      },
    );

    const getYieldEstimatesData = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          if (
            query?.yieldEstimatesContext &&
            query?.yieldEstimatesStartDate &&
            query?.yieldEstimates30DayEndDate &&
            query?.yieldEstimates60DayEndDate &&
            query?.yieldEstimates90DayEndDate
          ) {
            if (
              query.yieldEstimatesContext === 'all' ||
              crop.name === query?.yieldEstimatesContext
            ) {
              return {
                tentative30DayYield:
                  new Date(crop.estHarvestDate) >= new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(crop.estHarvestDate) <= new Date(query?.yieldEstimates30DayEndDate || '')
                    ? acc.tentative30DayYield + crop.estimatedYieldTonnes
                    : acc.tentative30DayYield,
                tentative60DayYield:
                  new Date(crop.estHarvestDate) >= new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(crop.estHarvestDate) <= new Date(query?.yieldEstimates60DayEndDate || '')
                    ? acc.tentative60DayYield + crop.estimatedYieldTonnes
                    : acc.tentative60DayYield,
                tentative90DayYield:
                  new Date(crop.estHarvestDate) >= new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(crop.estHarvestDate) <= new Date(query?.yieldEstimates90DayEndDate || '')
                    ? acc.tentative90DayYield + crop.estimatedYieldTonnes
                    : acc.tentative90DayYield,
              };
            }
          }
        }
        return { ...acc };
      },
      {
        tentative30DayYield: 0,
        tentative60DayYield: 0,
        tentative90DayYield: 0,
      },
    );

    const getHarvestHistoryData = JSON.parse(JSON.stringify(crops))?.reduce(
      (acc: any, crop: any) => {
        if (crop.active) {
          if (
            query?.harvestHistoryContext &&
            query?.harvestHistoryStartDate &&
            query?.harvestHistory30DayEndDate &&
            query?.harvestHistory60DayEndDate &&
            query?.harvestHistory90DayEndDate
          ) {
            if (
              query.harvestHistoryContext === 'all' ||
              crop.name === query?.harvestHistoryContext
            ) {
              return {
                harvest30DayHistory:
                  new Date(crop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(crop.actualHarvestDate) <=
                    new Date(query?.harvestHistory30DayEndDate || '')
                    ? acc.harvest30DayHistory + crop.actualYieldTonnes
                    : acc.harvest30DayHistory,
                harvest60DayHistory:
                  new Date(crop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(crop.actualHarvestDate) <=
                    new Date(query?.harvestHistory60DayEndDate || '')
                    ? acc.harvest60DayHistory + crop.actualYieldTonnes
                    : acc.harvest60DayHistory,
                harvest90DayHistory:
                  new Date(crop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(crop.actualHarvestDate) <=
                    new Date(query?.harvestHistory90DayEndDate || '')
                    ? acc.harvest90DayHistory + crop.actualYieldTonnes
                    : acc.harvest90DayHistory,
              };
            }
          }
        }

        return { ...acc };
      },
      {
        harvest30DayHistory: 0,
        harvest60DayHistory: 0,
        harvest90DayHistory: 0,
      },
    );

    const pendingEventsCount = crops?.reduce((acc: number, crop: any, index: number) => {
      let count = acc; // Initialize count with the accumulated value from the previous iteration
      crop?.plans[0]?.events?.forEach((event: any) => {
        let endDate = event?.range?.end;

        if (endDate) {
          const formattedDate =
            endDate.split('/').length === 3
              ? rearrangeDateDMYToYMD(endDate)
              : endDate + 'T00:00:00.000Z';
          const eventDate = dayjs(formattedDate);

          if (
            event.ccp === true &&
            event.eventStatus === 'Pending' &&
            dayjs(getDayJsMidnightISoString(dayjs())).isAfter(eventDate)
          ) {
            count++;
          }
        }
      });
      return count; // Return the updated count for the current crop
    }, 0);

    const cropLocations = JSON.parse(JSON.stringify(crops))?.reduce((acc: any, crop: any) => {
      const fieldMap = fields.find((field: any) => field._id.toString() === crop.field)?.map;
      const fieldLocation = fields.find(
        (field: any) => field._id.toString() === crop.field,
      )?.location;
      if (query?.geographicalDistributionCropType) {
        if (crop.name === query?.geographicalDistributionCropType) {
          return [
            ...acc,
            ...(fieldLocation ? [{ position: fieldLocation, data: crop.landParcel }] : []),
          ];
        }
        return [...acc];
      }
      return [
        ...acc,
        ...(fieldLocation
          ? [{ position: fieldLocation, data: crop.landParcel, map: fieldMap }]
          : []),
      ];
    }, []);

    const getLandParcelsData = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (landParcel.active) {
          return {
            totalRegisteredArea: +acc.totalRegisteredArea + +landParcel.areaInAcres,
            totalSolarDryers: landParcel.solarDryerUnits
              ? +acc.totalSolarDryers + +landParcel.solarDryerUnits.length
              : +acc.totalSolarDryers,
            totalCompostingUnits: landParcel.compostingUnits
              ? +acc.totalCompostingUnits + +landParcel.compostingUnits.length
              : +acc.totalCompostingUnits,
            totalCalculatedArea: landParcel?.calculatedAreaInAcres
              ? +acc.totalCalculatedArea + +landParcel?.calculatedAreaInAcres
              : +acc.totalCalculatedArea,
            climateImpactScore: +acc.climateImpactScore + +landParcel.climateScore,
            complianceScore: +acc.complianceScore + +landParcel.complianceScore,
            lpLocations: [
              ...acc.lpLocations,
              ...(landParcel.location
                ? [{ position: landParcel.location, data: landParcel, map: landParcel.map }]
                : []),
            ],
          };
        }

        return { ...acc };
      },
      {
        totalRegisteredArea: 0,
        totalCalculatedArea: 0,
        climateImpactScore: 0,
        complianceScore: 0,
        lpLocations: [],
        totalSolarDryers: 0,
        totalCompostingUnits: 0,
      },
    );

    const formattedLpLocations = getLandParcelsData.lpLocations.filter(
      (lpLocation: any) => !Array.isArray(lpLocation.position),
    );

    const dbResult = {
      totalCrops: +getTotalActiveCrops?.totalCrops,
      totalCropTypes: +getActiveCropTypes?.totalActiveCropTypes,
      totalLandParcels: +getTotalActiveLandParcels?.totalLandParcels,
      totalFarmers: +getTotalActiveFarmers?.totalFarmers,
      totalProcessingSystems: +getTotalActiveProcessingSystems?.totalProcessingSystems,
      totalProcessors: +getTotalActiveProcessors?.totalProcessors,
      totalProducts: +getTotalActiveProducts?.totalProducts,
      totalProductBatches: +getTotalActiveProductBatches?.totalProductBatches,
      totalRegisteredArea: +getLandParcelsData.totalRegisteredArea,
      totalSolarDryers: +getLandParcelsData.totalSolarDryers,
      totalCompostingUnits: +getLandParcelsData.totalCompostingUnits,
      totalCalculatedArea: +getLandParcelsData.totalCalculatedArea,
      totalActiveCropsArea: +getTotalActiveCropsArea.totalActiveCropsArea,
      pendingEventsCount,
      pendingTasks: pendingTasks?.length,
      climateImpactScore: +getLandParcelsData.complianceScore,
      complianceScore: +getLandParcelsData.complianceScore,
      cropLocations: cropLocations,
      recentEvents: events,
      lpLocations: formattedLpLocations,
      tentativeYieldData: {
        next30DayAmount: +getYieldEstimatesData.tentative30DayYield,
        next60DayAmount: +getYieldEstimatesData.tentative60DayYield,
        next90DayAmount: +getYieldEstimatesData.tentative90DayYield,
      },
      harvestHistoryData: {
        last30DayAmount: +getHarvestHistoryData.harvest30DayHistory,
        last60DayAmount: +getHarvestHistoryData.harvest60DayHistory,
        last90DayAmount: +getHarvestHistoryData.harvest90DayHistory,
      },
      generalCropDistribution: generalDistributionCropData.generalCropDistribution,
      generalLandParcelDistribution:
        generalDistributionLandparcelData.generalLandParcelDistribution,
      generalFarmerDistribution: generalDistributionFarmerData.generalFarmerDistribution,
      generalTractorDistribution: generalDistributionTractorData.generalTractorDistribution,
      generalInsuranceDistribution: generalDistributionInsuranceData.generalInsuranceDistribution,
    };

    return postProcess(dbResult);
  } catch (error) {
    return error;
  }
};

const postProcess = (dbResult: any) => {
  try {
    return JSON.parse(JSON.stringify(dbResult));
  } catch (e) {
    console.log('ERROR in dashboardDetailsView:postProcess', e);
  }
};
