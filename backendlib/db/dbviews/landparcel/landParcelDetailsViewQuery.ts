const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);
const LPF_SCHEMA_ID = model2schemaId('landparcel_farmers');
const LPFApi = MongoAdapter.getModel(LPF_SCHEMA_ID);
const FARMER_SCHEMA_ID = model2schemaId('farmer');
const FarmerApi = MongoAdapter.getModel(FARMER_SCHEMA_ID);

export const landParcelDetailsViewQuery = async (lpId: any) => {
  const dbResult = await LPApi.aggregate([
    { $match: { _id: new ObjectId(lpId) } },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('landowners'),
        let: { landownersArray: '$landowners' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $in: [
                      {
                        $toString: '$_id'
                      },
                      {
                        $cond: {
                          if: { $isArray: '$$landownersArray' },
                          then: { $map: { input: '$$landownersArray', as: 'el', in: '$$el.id' } },
                          else: []
                        }
                      }
                    ]
                  },
                  { active: true }
                ]
              }
            }
          }
        ],
        as: 'landowners',
      },
    },

    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [
          { $match: { active: true } },
          { $addFields: { cropId: { $toString: '$_id' } } },
          {
            $lookup: {
              from: model2collection('events'),
              localField: 'cropId',
              foreignField: 'cropId',
              as: 'cropEvents',
            },
          },
        ],
        as: 'crops',
      },
    },
    {
      $lookup: {
        from: model2collection('landparcel_farmers'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        as: 'landParcelFarmers',
        pipeline: [
          {
            $match: { active: true },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('poultrybatches'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'poultrybatches',
      },
    },

    {
      $lookup: {
        from: model2collection('aquacrops'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true } }],
        as: 'aquacrops',
      },
    },
    {
      $lookup: {
        from: model2collection('cows'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true } }],
        as: 'cows',
      },
    },
    {
      $lookup: {
        from: model2collection('goats'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true } }],
        as: 'goats',
      },
    },
    {
      $lookup: {
        from: model2collection('sheeps'),
        localField: 'landParcelId',
        foreignField: 'landParcel.id',
        pipeline: [{ $match: { active: true } }],
        as: 'sheeps',
      },
    },
    {
      $lookup: {
        from: model2collection('productionsystems'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'productionSystems',
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
    {
      $lookup: {
        from: model2collection('croppingsystems'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'croppingSystems',
      },
    },
    {
      $lookup: {
        from: model2collection('plots'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        as: 'plots',
      },
    },
    {
      $lookup: {
        from: model2collection('fields'),
        localField: 'landParcelId',
        foreignField: 'landParcel',
        pipeline: [{ $match: { active: true } }],
        as: 'fields',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'landParcelId',
        foreignField: 'landParcelId',
        as: 'events',
        pipeline: [
          { $match: { status: { $ne: 'archived' } } },
          { $addFields: { sortDate: { $toDate: '$createdAt' } } },
          { $sort: { sortDate: -1 } },
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
          {
            $addFields: {
              extractedPhotoIds: {
                $map: {
                  input: '$photoRecords',
                  as: 'photo',
                  in: {
                    $arrayElemAt: [{ $split: ['$$photo.link', '/'] }, -1],
                  },
                },
              },
            },
          },
          {
            $lookup: {
              from: `${process.env.TENANT_NAME}.files`,
              localField: 'extractedPhotoIds',
              foreignField: 'filename',
              as: 'photosData',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'landParcelId',
        foreignField: 'landparcelId',
        pipeline: [{ $match: { active: true } }],
        as: 'plan',
      },
    },
    {
      $project: {
        landParcelId: 1,
        name: 1,
        areaInAcres: 1,
        climateScore: 1,
        complianceScore: 1,
        address: 1,
        surveyNumber: 1,
        passbookNumber: 1,
        map: 1,
        location: 1,
        landOwner: 1,
        landownerRef: 1,
        distanceFromServiceRoad: 1,
        adjacentLands: 1,
        basicUtilities: 1,
        waterSources: 1,
        powerSources: 1,
        solarDryerUnits: 1,
        farmhouses: 1,
        laborQuarters: 1,
        securityHouses: 1,
        scrapSheds: 1,
        medicalAssistances: 1,
        toilets: 1,
        dinings: 1,
        attractions: 1,
        compostingUnits: 1,
        outputProcessingUnits: 1,
        inputProcessingUnits: 1,
        seedProcessingUnits: 1,
        storeUnits: 1,
        supportUtilities: 1,
        alliedActivity: 1,
        processingUnits: 1,
        landOwnershipDocument: 1,
        landGovtMap: 1,
        landSupportDocument: 1,
        status: 1,
        documents: 1,
        schemes: 1,
        soilInfo: 1,
        farmTractors: 1,
        farmMachineries: 1,
        farmTools: 1,
        farmEquipments: 1,
        history: 1,
        landowners: 1,
        validationWorkflowId: 1,
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        fields: {
          _id: 1,
          name: 1,
          areaInAcres: 1,
          map: 1,
          fbId: 1,
          calculatedAreaInAcres: 1,
          fieldType: 1,
          landParcelMap: 1,
        },
        crops: {
          fbId: 1,
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          category: 1,
          seedVariety: 1,
          seedSource: 1,
          field: 1,
          croppingSystem: 1,
          plot: 1,
          cropEvents: 1,
          lanparcel: {
            id: 1,
          },
          status: 1,
        },
        poultrybatches: {
          _id: 1,
          poultryId: 1,
          field: 1,
          batchIdName: 1,
          poultryType: 1,
          purpose: 1,
          size: 1,
          chickPlacementDay: 1,
          chickSource: 1,
          breed: 1,
          estHarvestDate: 1,
          actualHarvestDate: 1,
          actualYieldSize: 1,
          actualYieldTonnes: 1,
          actualChickPlacementDay: 1,
          poultryPop: 1,
          productionSystem: 1,
          dayMortality: 1,
          cumulativeMortality: 1,
          mortalityPercentage: 1,
          weightGain: 1,
          risk: 1,
          feedStock: 1,
          feedExpiry: 1,
          farmer: 1,
          landParcel: 1,
          climateScore: 1,
          complianceScore: 1,
          status: 1,
          documents: 1,
          history: 1,
          costOfCultivation: 1,
        },
        aquacrops: {
          _id: 1,
          cropType: 1,
          cropSubType: 1,
          quantity: 1,
          plannedStockingDate: 1,
          estHarvestDate: 1,
          estimatedYieldTonnes: 1,
          seedVariety: 1,
          seedSource: 1,
          seedEvidence: 1,
          seedCertificate: 1,
          actualYieldTonnes: 1,
          actualStockingDate: 1,
          actualHarvestDate: 1,
          costOfCultivation: 1,
          aquaPop: 1,
          productionSystem: 1,
          field: 1,
          status: 1,
          fbId: 1,
        },
        cows: {
          _id: 1,
          tagId: 1,
          age: 1,
          breed: 1,
          cowSource: 1,
          gender: 1,
          pedigree: 1,
          productionSystem: 1,
          field: 1,
          status: 1,
          acquisitionDay: 1,
        },
        goats: {
          _id: 1,
          tagId: 1,
          age: 1,
          breed: 1,
          goatSource: 1,
          gender: 1,
          pedigree: 1,
          productionSystem: 1,
          field: 1,
          status: 1,
          acquisitionDay: 1,
        },
        sheeps: {
          _id: 1,
          tagId: 1,
          age: 1,
          breed: 1,
          sheepSource: 1,
          gender: 1,
          pedigree: 1,
          productionSystem: 1,
          field: 1,
          status: 1,
          acquisitionDay: 1,
        },
        croppingSystems: {
          _id: 1,
          name: 1,
          field: 1,
          category: 1,
          season: 1,
          status: 1,
          landParcel: 1,
        },
        plots: { _id: 1, name: 1, field: 1, category: 1, season: 1, status: 1, area: 1, map: 1 },
        productionSystems: { _id: 1, name: 1, field: 1, category: 1, status: 1, landParcel: 1 },
        processingSystems: { _id: 1, name: 1, field: 1, category: 1, status: 1, landParcel: 1 },
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          location: 1,
          photoRecords: 1,
          startDate: 1,
          endDate: 1,
          details: 1,
          users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
          photosData: { filename: 1, metadata: 1 },
        },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = async (dbResult: any) => {
  try {
    const lpLinks = await LPFApi.list({ landParcel: dbResult[0].landParcelId, active: true });
    let farmer: any;
    let processor: any;
    let ownership = 'Own';
    let leaseDocuments: any;
    await Promise.all(
      lpLinks.map(async (link: any) => {
        if (link.farmer) {
          farmer = await FarmerApi.get(link.farmer);
          if (link.own) {
            if (link.own === true) {
              ownership = 'Own'
            } else {
              ownership = 'Leased'
            }
          } else {
            ownership = link.ownership;
          }
          leaseDocuments = link?.leaseDocuments;
        }
        if (link.processor) processor = await FarmerApi.get(link.processor);
      }),
    );
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.landParcelId,
      entityProgress: {
        plan: {
          id: item.plan[0]?._id,
          name: item.plan[0]?.name,
          events: item.plan[0]?.events,
        },
      },

      ownership,
      leaseDocuments,
      crops: item.crops.map((c: any) => ({
        ...c,
        id: c._id,
        countOfEvents: c?.cropEvents?.length,
      })),
      farmer: { ...farmer, id: farmer?._id.toString() },
      processor: { ...processor, id: processor?._id.toString() },
      poultrybatches: item.poultrybatches.map((b: any) => ({ ...b, id: b._id })),
      aquacrops: item.aquacrops.map((ac: any) => ({ ...ac, id: ac._id })),
      cows: item.cows.map((w: any) => ({ ...w, id: w._id })),
      goats: item.goats.map((g: any) => ({ ...g, id: g._id })),
      sheeps: item.sheeps.map((h: any) => ({ ...h, id: h._id })),
      fields: item.fields.map((f: any) => ({ ...f, id: f._id })),
      events: item.events.map((e: any) => ({
        ...e,
        id: e._id,
        createdBy: {
          id: e.createdBy,
          name:
            e.users[0]?.personalDetails.firstName +
            ' ' +
            (e.users[0]?.personalDetails.lastName || ''),
        },
        markers: e.photosData?.map((photo: any) => ({
          position: {
            lat: photo.metadata?.location?.lat,
            lng: photo.metadata?.location?.lng,
          },
        })),
      })),
      croppingSystems: item.croppingSystems.map((s: any) => ({ ...s, id: s._id })),
      plots: item.plots.map((o: any) => ({ ...o, id: o._id })),
      productionSystems: item.productionSystems.map((p: any) => ({ ...p, id: p._id })),
      processingSystems: item.processingSystems.map((r: any) => ({ ...r, id: r._id })),
      farmhouses: item.farmhouses?.map((fh: any) => ({ ...fh, id: fh._id })),
      laborQuarters: item.laborQuarters?.map((lq: any) => ({ ...lq, id: lq._id })),
      securityHouses: item.securityHouses?.map((sh: any) => ({ ...sh, id: sh._id })),
      scrapSheds: item.scrapSheds?.map((ss: any) => ({ ...ss, id: ss._id })),
      medicalAssistances: item.medicalAssistances?.map((ma: any) => ({ ...ma, id: ma._id })),
      toilets: item.toilets?.map((to: any) => ({ ...to, id: to._id })),
      dinings: item.dinings?.map((di: any) => ({ ...di, id: di._id })),
      attractions: item.attractions?.map((at: any) => ({ ...at, id: at._id })),
      solarDryerUnits: item.solarDryerUnits?.map((sd: any) => ({ ...sd, id: sd._id })),
      landowners: item.landowners?.map((lo: any) => ({ ...lo, id: lo._id })),
    }));
    //console.log("result.landowners", result.landowners);
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in landParcelDetailsViewQuery:postProcess', e);
  }
};
