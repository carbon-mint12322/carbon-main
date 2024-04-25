const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';
import { getDayJsMidnightISoString } from '~/frontendlib/utils/getDayJsMidnightISoString';
import dayjs from 'dayjs';

const CROP_SCHEMA_ID = model2schemaId('crop');
const CropApi = MongoAdapter.getModel(CROP_SCHEMA_ID);

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

const AQUARCROP_SCHEMA_ID = model2schemaId('aquacrops');
const AquaCropApi = MongoAdapter.getModel(AQUARCROP_SCHEMA_ID);

const AQUACROP_SCHEMA_ID_SCHEMA_ID = model2schemaId('aquacrops');
const AquaApi = MongoAdapter.getModel(AQUACROP_SCHEMA_ID_SCHEMA_ID);

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
  geographicalDistributionCropType?: string;
  org?: string;
}

export const aquadashboardDetailsView = async (query: Query) => {
  try {
    const listAqua = (collective: any) =>
      AquaApi.aggregate([
        { $match: { collective: JSON.parse(JSON.stringify(collective))._id.toString() } },
        { $addFields: { aquacropId: { $toString: '$_id' } } },

        {
          $lookup: {
            from: model2collection('plans'),
            localField: 'aquacropId',
            foreignField: 'aquacropId',
            as: 'aquaPlan',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            aquacropPlan: { events: { ccp: 1, eventStatus: 1, range: 1 } },
          },
        },
      ]);

    const listTasks = (filter = {}, options?: any) => TaskApi.list(filter, options);

    const listFields = (filter = {}, options?: any) => FieldApi.list(filter, options);
    const listFarmers = (filter = {}, options?: any) => FarmerApi.list(filter, options);
    const listLandParcels = (filter = {}, options?: any) => LPApi.list(filter, options);
    const listProductionSystems = (filter = {}, options?: any) =>
      ProductionSystemApi.list(filter, options);
    const listAquaCrops = (filter = {}, options?: any) => AquaCropApi.list(filter, options);
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
      {
        $lookup: {
          from: model2collection('poultrybatches'),
          localField: 'poultryObjectId',
          foreignField: '_id',
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

    const aquaCrops = await listAquaCrops(
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

    const uniqueLandParcels: any = [];
    const getTotalHighRiskFarms = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active && aquaCrop.risk === 'High') {
          if (aquaCrop.landParcel && !uniqueLandParcels.includes(aquaCrop.landParcel)) {
            uniqueLandParcels.push(aquaCrop.landParcel);
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
    const poultry = await listAqua(collective);

    const today = new Date().toISOString().split('T')[0];

    const getTotalActiveShrimpCrops = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active && aquaCrop.cropType === 'Shrimp') {
          return {
            totalActiveShrimpCrops: acc.totalActiveShrimpCrops + 1,
          };
        }
        return { ...acc };
      },
      {
        totalActiveShrimpCrops: 0,
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

    const generalDistributionCropData = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active) {
          // Get production system and field details
          const productionSystem = productionSystems.find(
            (ps: any) => ps._id.toString() === aquaCrop.productionSystem,
          );
          const field = fields.find((f: any) => f._id.toString() === productionSystem?.field);

          if (productionSystem && field) {
            if (query?.generalDistributionCropContext === 'aquaType') {
              // Get production system and field details

              return {
                generalCropDistribution: {
                  ...acc.generalCropDistribution,
                  [aquaCrop.cropType]: acc.generalCropDistribution?.[aquaCrop.cropType]
                    ? acc.generalCropDistribution?.[aquaCrop.cropType] + field.areaInAcres
                    : field.areaInAcres,
                },
              };
            }

            if (query?.generalDistributionCropContext === 'seedVariety') {
              return {
                generalCropDistribution: {
                  ...acc.generalCropDistribution,
                  [aquaCrop.seedVariety]: acc.generalCropDistribution?.[aquaCrop.seedVariety]
                    ? acc.generalCropDistribution?.[aquaCrop.seedVariety] + field.areaInAcres
                    : field.areaInAcres,
                },
              };
            }
          }
        }
        return { ...acc };
      },
      {
        generalCropDistribution: {},
      },
    );

    const generalDistributionLandParcelData = JSON.parse(JSON.stringify(landParcels))?.reduce(
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
        generalActiveLandParcelDistribution: {},
      },
    );

    const getYieldEstimatesData = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active) {
          if (
            query?.yieldEstimatesContext &&
            query?.yieldEstimatesStartDate &&
            query?.yieldEstimates30DayEndDate &&
            query?.yieldEstimates60DayEndDate &&
            query?.yieldEstimates90DayEndDate
          ) {
            if (
              query.yieldEstimatesContext === 'all' ||
              aquaCrop.cropType === query?.yieldEstimatesContext
            ) {
              return {
                tentative30DayYield:
                  new Date(aquaCrop.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(aquaCrop.estHarvestDate) <=
                    new Date(query?.yieldEstimates30DayEndDate || '')
                    ? acc.tentative30DayYield + aquaCrop.estimatedYieldTonnes
                    : acc.tentative30DayYield,
                tentative60DayYield:
                  new Date(aquaCrop.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(aquaCrop.estHarvestDate) <=
                    new Date(query?.yieldEstimates60DayEndDate || '')
                    ? acc.tentative60DayYield + aquaCrop.estimatedYieldTonnes
                    : acc.tentative60DayYield,
                tentative90DayYield:
                  new Date(aquaCrop.estHarvestDate) >=
                    new Date(query?.yieldEstimatesStartDate || '') &&
                    new Date(aquaCrop.estHarvestDate) <=
                    new Date(query?.yieldEstimates90DayEndDate || '')
                    ? acc.tentative90DayYield + aquaCrop.estimatedYieldTonnes
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

    const getHarvestHistoryData = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        if (aquaCrop.active) {
          if (
            query?.harvestHistoryContext &&
            query?.harvestHistoryStartDate &&
            query?.harvestHistory30DayEndDate &&
            query?.harvestHistory60DayEndDate &&
            query?.harvestHistory90DayEndDate
          ) {
            if (
              query.harvestHistoryContext === 'all' ||
              aquaCrop.name === query?.harvestHistoryContext
            ) {
              return {
                harvest30DayHistory:
                  new Date(aquaCrop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(aquaCrop.actualHarvestDate) <=
                    new Date(query?.harvestHistory30DayEndDate || '')
                    ? acc.harvest30DayHistory + aquaCrop.actualYieldTonnes
                    : acc.harvest30DayHistory,
                harvest60DayHistory:
                  new Date(aquaCrop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(aquaCrop.actualHarvestDate) <=
                    new Date(query?.harvestHistory60DayEndDate || '')
                    ? acc.harvest60DayHistory + aquaCrop.actualYieldTonnes
                    : acc.harvest60DayHistory,
                harvest90DayHistory:
                  new Date(aquaCrop.actualHarvestDate) >=
                    new Date(query?.harvestHistoryStartDate || '') &&
                    new Date(aquaCrop.actualHarvestDate) <=
                    new Date(query?.harvestHistory90DayEndDate || '')
                    ? acc.harvest90DayHistory + aquaCrop.actualYieldTonnes
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

    const pendingEventsCount = aquaCrops?.reduce((acc: number, aquacrop: any, index: number) => {
      let count = acc;
      aquacrop?.aquacropPlan?.[0]?.events?.forEach((event: any) => {
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

    const cropLocations = JSON.parse(JSON.stringify(aquaCrops))?.reduce(
      (acc: any, aquaCrop: any) => {
        const pbfield = productionSystems.find(
          (productionSystem: any) => productionSystem._id.toString() === aquaCrop.productionSystem,
        )?.field;
        const fieldMap = fields.find((field: any) => field._id.toString() === pbfield)?.map;
        const fieldLocation = fields.find(
          (field: any) => field._id.toString() === pbfield,
        )?.location;
        if (query?.geographicalDistributionCropType) {
          if (aquaCrop.cropType === query?.geographicalDistributionCropType) {
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
            ? [{ position: fieldLocation, data: aquaCrop.landParcel.id, map: fieldMap }]
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

      pendingTasks: pendingTasks?.length,
      pendingEventsCount,

      totalAquaCrops: +getTotalActiveAquaCrops?.totalActiveAquaCrops,
      totalAquacultureProductionSystems:
        +getTotalAquacultureProductionSystems?.totalAquacultureProductionSystems,
      totalShrimpCrops: +getTotalActiveShrimpCrops?.totalActiveShrimpCrops,
      totalFarmers: +getTotalActiveFarmers?.totalFarmers,
      totalRegisteredArea: +getLandParcelsData.totalRegisteredArea,
      totalCalculatedArea: +getLandParcelsData.totalCalculatedArea,

      climateImpactScore: +getLandParcelsData.complianceScore,
      complianceScore: +getLandParcelsData.complianceScore,
      cropLocations: cropLocations,
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
      generalCropDistribution: generalDistributionCropData.generalCropDistribution,
      generalLandParcelDistribution:
        generalDistributionLandParcelData.generalLandParcelDistribution,
      generalActiveLandParcelDistribution:
        generalDistributionActiveLandParcelData.generalActiveLandParcelDistribution,
    };

    //console.log('dbResult', dbResult);
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
    console.log('ERROR in aquadashboardDetailsView:postProcess', e);
  }
};
