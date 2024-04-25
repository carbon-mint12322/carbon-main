const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const COLLECTIVE_SCHEMA_ID = model2schemaId('collective');
const CollectiveApi = MongoAdapter.getModel(COLLECTIVE_SCHEMA_ID);

export const collectiveDetailsViewQuery = async (collectiveId: any) => {
  const dbResult = await CollectiveApi.aggregate([
    { $match: { _id: new ObjectId(collectiveId) } },
    { $addFields: { collectiveId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('mastercrops'),
        localField: 'collectiveId',
        foreignField: 'collective',
        as: 'mastercrops',
      },
    },
    {
      $lookup: {
        from: model2collection('schemes'),
        localField: 'collectiveId',
        foreignField: 'schemeOwner',
        as: 'schemeslist',
      },
    },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'collectiveId',
        foreignField: 'collectives',
        as: 'farmers',
        pipeline: [
          {
            $match: {
              $or: [{ osps: { $exists: true } }, { inspectionDetails: { $exists: true } }],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('organicsystemplans'),
        localField: 'collectiveId',
        foreignField: 'collective',
        as: 'organicsystemplans',
      },
    },
    {
      $lookup: {
        from: model2collection('transactioncertificates'),
        localField: 'collectiveId',
        foreignField: 'collective',
        as: 'transactioncertificates',
        pipeline: [
          {
            $addFields: {
              cbObjectId: {
                $toObjectId: '$cb.id',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('certificationbodies'),
              localField: 'cbObjectId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'cbs',
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'collectiveId',
        foreignField: 'collectiveId',
        pipeline: [{ $match: { active: true } }],
        as: 'plan',
      },
    },
    {
      $lookup: {
        from: model2collection('users'),
        let: { slug: '$slug' },
        pipeline: [
          {
            $addFields: {
              rolesArray: { $objectToArray: '$roles' },
            },
          },
          {
            $addFields: {
              filteredRolesArray: {
                $filter: {
                  input: '$rolesArray',
                  cond: { $eq: ['$$this.k', '$$slug'] },
                },
              },
            },
          },
          { $match: { filteredRolesArray: { $ne: [] } } },
          { $addFields: { rolesList: { $arrayElemAt: ['$filteredRolesArray.v', 0] } } },
          { $sort: { _id: -1 } },

        ],
        as: 'users',
      },
    },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'collectiveId',
        foreignField: 'collectiveId',
        as: 'events',
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: model2collection('histories'),
        let: { collectiveId: '$collectiveId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$relatedTo.objectId', '$$collectiveId'] },
                  { $eq: ['$relatedTo.schemaId', '/farmbook/collective'] },
                ],
              },
            },
          },
          {
            $addFields: {
              objectIdCreatedBy: {
                $toObjectId: '$createdBy',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('users'),
              localField: 'objectIdCreatedBy',
              foreignField: '_id',
              as: 'createdByUser',
            },
          },
          {
            $addFields: {
              createdByUserItem: {
                $arrayElemAt: ['$createdByUser', 0],
              },
            },
          },
          {
            $project: {
              createdBy: 0,
            },
          },
        ],
        as: 'histories',
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        name: 1,
        slug: 1,
        category: 1,
        address: 1,
        email: 1,
        poc: 1,
        phone: 1,
        schemes: 1,
        schemeslist: 1,
        documents: 1,
        history: 1,
        farmTractors: 1,
        farmMachineries: 1,
        validationWorkflowId: 1,
        farmTools: 1,
        farmEquipments: 1,
        mandator: 1,
        fpoDetails: 1,
        fpcDetails: 1,
        status: 1,
        aggregationPlanDetails: 1,
        compliantDetails: 1,
        disputeDetails: 1,
        documentDetails: 1,
        groups: 1,
        inputLogs: 1,
        inputPermissionDetails: 1,
        externalInspectionDetails: 1,
        ngmoTestRecords: 1,
        nonConfirmityDetails: 1,
        samplingDetails: 1,
        sanctionDetails: 1,
        scopeCertificationDetails: 1,
        subGroups: 1,
        validationDetails: 1,
        schemeDetails: 1,
        evaluationDetails: 1,
        harvestUpdateDetails: 1,
        mastercrops: {
          fbId: 1,
          _id: 1,
          cropName: 1,
          name: 1,
          season: 1,
          seedVariety: 1,
          seedSource: 1,
          mcId: 1,
          active: 1,
          cropType: 1,
        },
        farmers: { personalDetails: 1, operatorDetails: 1, osps: 1, inspectionDetails: 1 },
        organicsystemplans: {
          _id: 1,
          icsDetails: 1,
          seedDependencies: 1,
          inputDependencies: 1,
          bufferCrops: 1,
          productionSystemOverview: 1,
          conversionRequirements: 1,
          postHarvestHandling: 1,
          soilManagement: 1,
          waterManagement: 1,
          organicAwareness: 1,
          buyBackDetails: 1,
          internalInspectionstran: 1,
          records: 1,
          attachments: 1,
          otherRemarks: 1,
          ospYear: 1,
          fbId: 1,
        },
        transactioncertificates: {
          _id: 1,
          fbId: 1,
          expiryDate: 1,
          issuedDate: 1,
          lotNo: 1,
          scheme: 1,
          effectiveDate: 1,
          conversionStatus: 1,
          aggregationPlan: 1,
          scope: 1,
          cb: 1,
          ngmoRecords: 1,
          attachments: 1,
          otherRemarks: 1,
          cbs: { name: 1 },
        },
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
        users: 1,
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
        },
        histories: {
          _id: 1,
          relatedTo: 1,
          modifications: 1,
          createdBy: 1,
          createdAt: 1,
          userItem: { $arrayElemAt: ['$histories.createdByUserItem', 0] },
        },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => {
      return {
        ...item,
        id: item._id,
        mastercrops: item.mastercrops.map((m: any) => ({ ...m, id: m._id })),
        schemeslist: item.schemeslist.map((sl: any) => ({ ...sl, id: sl._id })),
        farmerosps: item.farmers
          .filter((i: any) => i.osps)
          .map((f: any) => ({
            osps: f.osps.map((o: any) => ({
              ...o,
              personalDetails: f.personalDetails,
              operatorDetails: f.operatorDetails,
            })),
          }))
          .flatMap((item: any) => item.osps),
        internalInspectionDetails: item.farmers
          .filter((i: any) => i.inspectionDetails)
          .map((f: any) => ({
            inspectionDetails: f.inspectionDetails.map((i: any) => ({
              ...i,
              personalDetails: f.personalDetails,
              operatorDetails: f.operatorDetails,
            })),
          }))
          .flatMap((item: any) => item.inspectionDetails),
        organicsystemplans: item.organicsystemplans.map((o: any) => ({ ...o, id: o._id })),
        transactioncertificates: item.transactioncertificates.map((tc: any) => ({
          ...tc,
          id: tc._id,
        })),
        entityProgress: {
          plan: {
            id: item.plan[0]?._id,
            name: item.plan[0]?.name,
            events: item.plan[0]?.events,
          },
        },
        histories: item.histories.map((h: any) => ({ ...h, id: h._id })),
      };
    });
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR collectiveDetailsViewQuery:postProcess', e);
  }
};
