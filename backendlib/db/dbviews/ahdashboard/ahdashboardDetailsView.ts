const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';
import dayjs from 'dayjs';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

const POULTRYBATCH_SCHEMA_ID_SCHEMA_ID = model2schemaId('poultrybatches');
const PoultryApi = MongoAdapter.getModel(POULTRYBATCH_SCHEMA_ID_SCHEMA_ID);

const AQUARCROP_SCHEMA_ID = model2schemaId('aquacrops');
const AquaCropApi = MongoAdapter.getModel(AQUARCROP_SCHEMA_ID);

const COW_SCHEMA_ID = model2schemaId('cow');
const CowApi = MongoAdapter.getModel(COW_SCHEMA_ID);

const GOAT_SCHEMA_ID = model2schemaId('goat');
const GoatApi = MongoAdapter.getModel(GOAT_SCHEMA_ID);

const SHEEP_SCHEMA_ID = model2schemaId('sheep');
const SheepApi = MongoAdapter.getModel(SHEEP_SCHEMA_ID);

const EVENTS_SCHEMA_ID = model2schemaId('event');
const EventsApi = MongoAdapter.getModel(EVENTS_SCHEMA_ID);

const FIELD_SCHEMA_ID = model2schemaId('field');
const FieldApi = MongoAdapter.getModel(FIELD_SCHEMA_ID);

const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);

const COLLECTIVE_SCHEMA_ID = model2schemaId('collective');
const CollectiveApi = MongoAdapter.getModel(COLLECTIVE_SCHEMA_ID);

const PRODUCTIONSYSTEM_SCHEMA_ID = model2schemaId('productionsystem');
const ProductionSystemApi = MongoAdapter.getModel(PRODUCTIONSYSTEM_SCHEMA_ID);

const POULTRYBATCH_SCHEMA_ID = model2schemaId('poultrybatches');
const PoultryBatchApi = MongoAdapter.getModel(POULTRYBATCH_SCHEMA_ID);

const TASKS_SCHEMA_ID = model2schemaId('task');
const TaskApi = MongoAdapter.getModel(TASKS_SCHEMA_ID);

interface Query {
  geographicalDistributionContext?: string;
  geographicalDistributionSubType?: string;
  generalDistributionContext?: string;
  generalDistributionCropContext?: string;
  generalDistributionProductionSystemContext?: string;
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
  geographicalDistributionProductionSystemType?: string;
  org?: string;
}

export const ahdashboardDetailsView = async (query: Query) => {
  try {
    const listPoultry = (collective: any) =>
      PoultryApi.aggregate([
        { $match: { collective: JSON.parse(JSON.stringify(collective))._id.toString() } },
        { $addFields: { poultryId: { $toString: '$_id' } } },

        {
          $lookup: {
            from: model2collection('plans'),
            localField: 'poultryId',
            foreignField: 'poultryId',
            pipeline: [
              {
                $match:
                  { active: true }
              }
            ],
            as: 'oldPlan',
          },
        },
        {// accomodate new reference link for poultry
          $lookup: {
            from: model2collection('plans'),
            localField: 'poultryId',
            foreignField: 'poultrybatchId',
            pipeline: [
              {
                $match:
                  { active: true }
              }
            ],
            as: 'plan',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            oldPlan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
            plan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
          },
        },
      ]);

    const listTasks = (filter = {}, options?: any) => TaskApi.list(filter, options);

    const listFields = (filter = {}, options?: any) => FieldApi.list(filter, options);
    const listFarmers = (filter = {}, options?: any) => FarmerApi.list(filter, options);
    const listLandParcels = (filter = {}, options?: any) => LPApi.list(filter, options);
    const listProductionSystems = (filter = {}, options?: any) =>
      ProductionSystemApi.list(filter, options);

    const listCows = (filter = {}, options?: any) => CowApi.list(filter, options);
    const listGoats = (filter = {}, options?: any) => GoatApi.list(filter, options);
    const listSheep = (filter = {}, options?: any) => SheepApi.list(filter, options);
    const listAquacultureCrops = (filter = {}, options?: any) => AquaCropApi.list(filter, options);

    const listPoultryBatches = (filter = {}, options?: any) =>
      PoultryBatchApi.list(filter, options);
    const collective = await CollectiveApi.getByFilter({ slug: query?.org });
    const pendingTasks = await listTasks(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
        status: { $ne: 'Completed' },
      },
      { _id: 1 },
    );
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
          pipeline: [{ $match: { active: true } }],
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
          poultryId: 1,
          aquacropId: 1,
          productionSystemId: 1,
          processingSystemId: 1,
          landParcelId: 1,
          location: { lat: 1, lng: 1 },
          name: 1,
          farmers: 1,
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

    const productionSystems = await listProductionSystems(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        category: 1,
        name: 1,
        field: 1,
        landParcel: 1,
        status: 1,
        active: 1,
      },
    );

    const poultryBatches = await listPoultryBatches(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },

      {
        _id: 1,
        poultryType: 1,
        purpose: 1,
        batchIdName: 1,
        size: 1,
        breed: 1,
        landParcel: 1,
        status: 1,
        active: 1,
      },
    );

    const aquaCrops = await listAquacultureCrops(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        cropType: 1,
        seedSource: 1,
        seedVariety: 1,
        quantity: 1,
        estimatedYieldTonnes: 1,
        productionSystem: 1,

        landParcel: { id: 1, name: 1 },
        status: 1,
        active: 1,
      },
    );

    const cows = await listCows(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        status: 1,
        active: 1,
      },
    );

    const goats = await listGoats(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        status: 1,
        active: 1,
      },
    );

    const sheep = await listSheep(
      {
        collective: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        status: 1,
        active: 1,
      },
    );

    const farmers = await listFarmers(
      {
        collectives: JSON.parse(JSON.stringify(collective))._id.toString(),
      },
      {
        _id: 1,
        personalDetails: { firstName: 1, lastName: 1 },
        personalOrgDetails: { orgName: 1, identificationNumber: 1 },
        farmingExperience: { totalFarmingExperienceYears: 1 },
        active: 1,
      },
    );

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
      },
    );

    const getTotalActivePoultryBatches = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active) {
          return {
            totalPoultryBatches: acc.totalPoultryBatches + 1,
          };
        }
        return { ...acc };
      },
      {
        totalPoultryBatches: 0,
      },
    );

    const getTotalActiveRearingPoultryBatches = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active && poultryBatch.purpose === 'Rearing') {
          return {
            totalRearingPoultryBatches: acc.totalRearingPoultryBatches + 1,
          };
        }
        return { ...acc };
      },
      {
        totalRearingPoultryBatches: 0,
      },
    );

    const getTotalActiveLayersPoultryBatches = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active && poultryBatch.purpose === 'Layers') {
          return {
            totalLayersPoultryBatches: acc.totalLayersPoultryBatches + 1,
          };
        }
        return { ...acc };
      },
      {
        totalLayersPoultryBatches: 0,
      },
    );



    const getTotalActiveCows = JSON.parse(JSON.stringify(cows))?.reduce(
      (acc: any, cow: any) => {
        if (cow.active) {
          return {
            totalCows: acc.totalCows + 1,
          };
        }
        return { ...acc };
      },
      {
        totalCows: 0,
      },
    );

    const getTotalActiveGoats = JSON.parse(JSON.stringify(goats))?.reduce(
      (acc: any, goat: any) => {
        if (goat.active) {
          return {
            totalGoats: acc.totalGoats + 1,
          };
        }
        return { ...acc };
      },
      {
        totalGoats: 0,
      },
    );

    const getTotalActiveAquaCrops = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active) {
          return {
            totalActiveAquaCrops: acc.totalActiveAquaCrops + 1,
          };
        }
        return { ...acc };
      },
      {
        totalActiveAquaCrops: 0,
      },
    );

    const getTotalActiveSheep = JSON.parse(JSON.stringify(sheep))?.reduce(
      (acc: any, sheepItem: any) => {
        if (sheepItem.active) {
          return {
            totalSheep: acc.totalSheep + 1,
          };
        }
        return { ...acc };
      },
      {
        totalSheep: 0,
      },
    );

    const getTotalAquacultureProductionSystems = JSON.parse(
      JSON.stringify(productionSystems),
    )?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Aquaculture') {
          return {
            totalAquacultureProductionSystems: acc.totalAquacultureProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalAquacultureProductionSystems: 0,
      },
    );

    const getTotalDairyProductionSystems = JSON.parse(JSON.stringify(productionSystems))?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Dairy') {
          return {
            totalDairyProductionSystems: acc.totalDairyProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalDairyProductionSystems: 0,
      },
    );

    const getTotalPoultryProductionSystems = JSON.parse(JSON.stringify(productionSystems))?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Poultry') {
          return {
            totalPoultryProductionSystems: acc.totalPoultryProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalPoultryProductionSystems: 0,
      },
    );

    const getTotalGoatProductionSystems = JSON.parse(JSON.stringify(productionSystems))?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Goats') {
          return {
            totalGoatProductionSystems: acc.totalGoatProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalGoatProductionSystems: 0,
      },
    );

    const getTotalSheepProductionSystems = JSON.parse(JSON.stringify(productionSystems))?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Sheep') {
          return {
            totalSheepProductionSystems: acc.totalSheepProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalSheepProductionSystems: 0,
      },
    );
    const getTotalSericultureProductionSystems = JSON.parse(
      JSON.stringify(productionSystems),
    )?.reduce(
      (acc: any, productionSystem: any) => {
        if (productionSystem.category === 'Sericulture') {
          return {
            totalSericultureProductionSystems: acc.totalSericultureProductionSystems + 1,
          };
        }
        return { ...acc };
      },
      {
        totalSericultureProductionSystems: 0,
      },
    );
    const uniqueLandParcels: any = [];
    const getTotalHighRiskFarms = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active && poultryBatch.risk === 'High') {
          if (poultryBatch.landParcel && !uniqueLandParcels.includes(poultryBatch.landParcel)) {
            uniqueLandParcels.push(poultryBatch.landParcel);
            return {
              totalHighRiskFarms: acc.totalHighRiskFarms + 1,
            };
          }
        }
        return { ...acc };
      },
      {
        totalHighRiskFarms: 0,
      },
    );
    const poultry = await listPoultry(collective);

    const getTotalPoultryDayMortality = async () => {
      let totalPoultryDayMortality = 0;
      const mortalityEvents = await EventsApi.list({
        name: 'poultryMortality',
        'details.startDate': dayjs().format('YYYY-MM-DD'),
        status: { $ne: 'archived' },
      });
      if (mortalityEvents.length > 0) {
        await Promise.all(
          mortalityEvents.map((event: any) => {
            totalPoultryDayMortality += event.details.noOfBirds;
          }),
        );
      }
      return totalPoultryDayMortality;
    };

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

    const generalDistributionProductionSystemData = JSON.parse(
      JSON.stringify(poultryBatches),
    )?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active) {
          if (query?.generalDistributionProductionSystemContext === 'poultryType') {
            return {
              generalProductionSystemDistribution: {
                ...acc.generalProductionSystemDistribution,
                ['Layers']:
                  poultryBatch.purpose === 'Layers'
                    ? acc.generalProductionSystemDistribution?.['Layers'] + poultryBatch.size
                    : poultryBatch.size,
                ['Rearing']:
                  poultryBatch.purpose === 'Rearing'
                    ? acc.generalProductionSystemDistribution?.['Rearing'] + poultryBatch.size
                    : poultryBatch.size,
              },
            };
          }

          if (query?.generalDistributionProductionSystemContext === 'poultryVariety') {
            return {
              generalProductionSystemDistribution: {
                ...acc.generalProductionSystemDistribution,
                [poultryBatch.breed]: acc.generalProductionSystemDistribution?.[poultryBatch.breed]
                  ? acc.generalProductionSystemDistribution?.[poultryBatch.breed] +
                  poultryBatch.size
                  : poultryBatch.size,
              },
            };
          }
        }
        return { ...acc };
      },
      {
        generalProductionSystemDistribution: {},
      },
    );

    const uniqueLandParcelsList: any = [];
    const generalDistributionLandParcelData = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (
          poultryBatch.active ||
          query?.generalDistributionLandParcelContext === 'activeInactive'
        ) {
          if (poultryBatch.landParcel && !uniqueLandParcelsList.includes(poultryBatch.landParcel)) {
            uniqueLandParcelsList.push(poultryBatch.landParcel);
            if (query?.generalDistributionLandParcelContext === 'size') {
              return {
                generalLandParcelDistribution: {
                  ...acc.generalLandParcelDistribution,
                  ['< 100']:
                    +poultryBatch.size < 100
                      ? (acc.generalLandParcelDistribution?.['< 100'] || 0) + 1
                      : acc.generalLandParcelDistribution?.['< 100'] || 0,
                  ['100 to 500']:
                    +poultryBatch.size >= 100 && +poultryBatch.size < 500
                      ? (acc.generalLandParcelDistribution?.['100 to 500'] || 0) + 1
                      : acc.generalLandParcelDistribution?.['100 to 500'] || 0,
                  ['500 to 1000']:
                    +poultryBatch.size >= 500 && +poultryBatch.size <= 1000
                      ? (acc.generalLandParcelDistribution?.['500 to 1000'] || 0) + 1
                      : acc.generalLandParcelDistribution?.['500 to 1000'] || 0,
                  ['> 1000']:
                    +poultryBatch.size > 1000
                      ? (acc.generalLandParcelDistribution?.['> 1000'] || 0) + +poultryBatch.size
                      : acc.generalLandParcelDistribution?.['> 1000'] || 0,
                },
              };
            }
          }
        }
        return { ...acc };
      },
      {
        generalLandParcelDistribution: {},
      },
    );

    const generalDistributionActiveLandParcelData = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (query?.generalDistributionLandParcelContext === 'activeInactive') {
          return {
            generalActiveLandParcelDistribution: {
              ...acc.generalActiveLandParcelDistribution,
              ['Active']:
                +landParcel.active === 1
                  ? (acc.generalActiveLandParcelDistribution?.['Active'] || 0) + 1
                  : acc.generalActiveLandParcelDistribution?.['Active'] || 0,
              ['Inactive']:
                +landParcel.active === 0
                  ? (acc.generalActiveLandParcelDistribution?.['Inactive'] || 0) + 1
                  : acc.generalActiveLandParcelDistribution?.['Inactive'] || 0,
            },
          };
        }

        return { ...acc };
      },
      {
        generalLandParcelDistribution: {},
      },
    );

    const getYieldEstimatesData = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active) {
          if (
            query?.yieldEstimatesContext &&
            query?.yieldEstimatesStartDate &&
            query?.yieldEstimates30DayEndDate &&
            query?.yieldEstimates60DayEndDate &&
            query?.yieldEstimates90DayEndDate
          ) {
            if (
              query.yieldEstimatesContext === 'allVarieties' ||
              poultryBatch.breed === query?.yieldEstimatesContext
            ) {
              return {
                tentative30DayYield:
                  new Date(poultryBatch.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(poultryBatch.estHarvestDate) <=
                    new Date(query?.yieldEstimates30DayEndDate || '')
                    ? acc.tentative30DayYield +
                    poultryBatch.size -
                    (poultryBatch.cumulativeMortality ? poultryBatch.cumulativeMortality : 0)
                    : acc.tentative30DayYield,
                tentative60DayYield:
                  new Date(poultryBatch.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(poultryBatch.estHarvestDate) <=
                    new Date(query?.yieldEstimates60DayEndDate || '')
                    ? acc.tentative60DayYield +
                    poultryBatch.size -
                    (poultryBatch.cumulativeMortality ? poultryBatch.cumulativeMortality : 0)
                    : acc.tentative60DayYield,
                tentative90DayYield:
                  new Date(poultryBatch.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(poultryBatch.estHarvestDate) <=
                    new Date(query?.yieldEstimates90DayEndDate || '')
                    ? acc.tentative90DayYield +
                    poultryBatch.size -
                    (poultryBatch.cumulativeMortality ? poultryBatch.cumulativeMortality : 0)
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

    const getHarvestHistoryData = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        if (poultryBatch.active) {
          if (
            query?.harvestHistoryContext &&
            query?.harvestHistoryStartDate &&
            query?.harvestHistory30DayEndDate &&
            query?.harvestHistory60DayEndDate &&
            query?.harvestHistory90DayEndDate
          ) {
            if (
              query.harvestHistoryContext === 'allVarieties' ||
              poultryBatch.breed === query?.harvestHistoryContext
            ) {
              return {
                harvest30DayHistory:
                  new Date(poultryBatch.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(poultryBatch.actualHarvestDate) <=
                    new Date(query?.harvestHistory30DayEndDate || '')
                    ? acc.harvest30DayHistory + poultryBatch.actualYieldSize
                    : acc.harvest30DayHistory,
                harvest60DayHistory:
                  new Date(poultryBatch.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(poultryBatch.actualHarvestDate) <=
                    new Date(query?.harvestHistory60DayEndDate || '')
                    ? acc.harvest60DayHistory + poultryBatch.actualYieldSize
                    : acc.harvest60DayHistory,
                harvest90DayHistory:
                  new Date(poultryBatch.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(poultryBatch.actualHarvestDate) <=
                    new Date(query?.harvestHistory90DayEndDate || '')
                    ? acc.harvest90DayHistory + poultryBatch.actualYieldSize
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
    const pendingEventsCount = poultry?.reduce((acc: number, poultry: any, index: number) => {
      let count = acc;
      const plan = poultry?.oldPlan.length > 0 ? poultry?.oldPlan : poultry?.plan
      plan?.[0]?.events?.forEach((event: any) => {
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

    const productionSystemLocations = JSON.parse(JSON.stringify(poultryBatches))?.reduce(
      (acc: any, poultryBatch: any) => {
        const pbfield = productionSystems.find(
          (productionSystem: any) =>
            productionSystem._id.toString() === poultryBatch.productionSystem,
        )?.field;
        const fieldMap = fields.find((field: any) => field._id.toString() === pbfield)?.map;
        const fieldLocation = fields.find(
          (field: any) => field._id.toString() === pbfield,
        )?.location;
        if (query?.geographicalDistributionProductionSystemType) {
          if (poultryBatch.breed === query?.geographicalDistributionProductionSystemType) {
            return [
              ...acc,
              ...(fieldLocation ? [{ position: fieldLocation, data: pbfield.landParcel }] : []),
            ];
          }
          return [...acc];
        }
        return [
          ...acc,
          ...(fieldLocation
            ? [{ position: fieldLocation, data: poultryBatch.landParcel?.id, map: fieldMap }]
            : []),
        ];
      },
      [],
    );

    const getLandParcelsData = JSON.parse(JSON.stringify(landParcels))?.reduce(
      (acc: any, landParcel: any) => {
        if (landParcel.active) {
          return {
            totalRegisteredArea: +acc.totalRegisteredArea + +landParcel.areaInAcres,
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
      },
    );

    const dbResult = {
      totalLandParcels: +getTotalActiveLandParcels?.totalLandParcels,
      totalHighRiskFarms: +getTotalHighRiskFarms?.totalHighRiskFarms,
      totalPoultryDayMortality: await getTotalPoultryDayMortality(),
      pendingTasks: pendingTasks?.length,
      pendingEventsCount,

      totalPoultryBatches: +getTotalActivePoultryBatches?.totalPoultryBatches,
      totalRearingPoultryBatches: +getTotalActiveRearingPoultryBatches?.totalRearingPoultryBatches,
      totalLayerPoultryBatches: +getTotalActiveLayersPoultryBatches?.totalLayersPoultryBatches,
      totalFarmers: +getTotalActiveFarmers?.totalFarmers,
      totalAquacultureProductionSystems:
        +getTotalAquacultureProductionSystems?.totalAquacultureProductionSystems,
      totalDairyProductionSystems: +getTotalDairyProductionSystems?.totalDairyProductionSystems,
      totalPoultryProductionSystems:
        +getTotalPoultryProductionSystems?.totalPoultryProductionSystems,
      totalGoatProductionSystems: +getTotalGoatProductionSystems?.totalGoatProductionSystems,
      totalCows: +getTotalActiveCows?.totalCows,
      totalGoats: +getTotalActiveGoats?.totalCows,
      totalSheep: +getTotalActiveSheep?.totalSheep,
      totalAquacultureCrops: +getTotalActiveAquaCrops?.totalActiveAquaCrops,
      totalSheepProductionSystems: +getTotalSheepProductionSystems?.totalSheepProductionSystems,
      totalSericultureProductionSystems:
        +getTotalSericultureProductionSystems?.totalSericultureSystems,
      totalRegisteredArea: +getLandParcelsData.totalRegisteredArea,
      totalCalculatedArea: +getLandParcelsData.totalCalculatedArea,

      climateImpactScore: +getLandParcelsData.complianceScore,
      complianceScore: +getLandParcelsData.complianceScore,
      productionSystemLocations: productionSystemLocations,
      recentEvents: events,
      lpLocations: getLandParcelsData.lpLocations,
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
      generalProductionSystemDistribution:
        generalDistributionProductionSystemData.generalProductionSystemDistribution,
      generalLandParcelDistribution:
        generalDistributionLandParcelData.generalLandParcelDistribution,
      generalActiveLandParcelDistribution:
        generalDistributionActiveLandParcelData.generalActiveLandParcelDistribution,
    };
    return postProcess(dbResult);
  } catch (error) {
    console.log('DB Result', error);
    return error;
  }
};

const postProcess = (dbResult: any) => {
  try {
    return JSON.parse(JSON.stringify(dbResult));
  } catch (e) {
    console.log('ERROR in ahdashboardDetailsView:postProcess', e);
  }
};
