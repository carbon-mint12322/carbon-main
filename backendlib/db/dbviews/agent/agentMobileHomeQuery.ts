import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const AGENT_SCHEMA_ID = model2schemaId('agent');
const AgentApi = MongoAdapter.getModel(AGENT_SCHEMA_ID);

export const agentMobileHomeQuery = async (
  userId: any,
  limit: number = 20,
  skip: number = 0,
  search: string = '',
) => {
  const match = (role: string) => ({
    $and: [
      { active: true }, // Add your other conditions here
      {
        $or: [
          { 'personalDetails.firstName': { $regex: search, $options: 'i' } }, // Case-insensitive search
          { 'personalDetails.lastName': { $regex: search, $options: 'i' } }, // Add more fields as needed
        ],
      },
      role === 'farmers'
        ? { $or: [{ type: { $exists: false } }, { type: 'Farmer' }] }
        : { type: 'Processor' },
    ],
  });

  const getRelations = (role: string) => [
    // Farmer counts
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'agentId',
        foreignField: 'agents',
        as: `${role}_count`,
        pipeline: [
          {
            $match: match(role),
          },
          {
            $count: 'total',
          },
        ],
      },
    },
    // Farmer records
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'agentId',
        foreignField: 'agents',
        as: role,
        pipeline: [
          { $match: match(role) },
          {
            $project: {
              agentId: 1,
              personalDetails: 1,
              operatorDetails: 1,
              type: 1,
              collectives: {
                $map: {
                  input: '$collectives',
                  as: 'collective',
                  in: {
                    $convert: {
                      input: '$$collective',
                      to: 'objectId',
                    },
                  },
                },
              },
            },
          },
          {
            $lookup: {
              from: model2collection('collectives'),
              localField: 'collectives',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'collectives',
            },
          },
          {
            $sort: { _id: -1 },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
      },
    },
    // farmer details relations
    {
      $addFields: {
        [`${role}Ids`]: {
          $map: {
            input: `$${role}`,
            in: {
              [`${role}Id`]: {
                $toString: '$$this._id',
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection(`landparcel_farmers`),
        localField: `${role}Ids.${role}Id`,
        // TODO: we need to make sure to add conditions if we have more roles in future or we need to change the data structure of the relational collection
        foreignField: role === 'farmers' ? 'farmer' : 'processor',
        pipeline: [
          { $match: { active: true } },
          // { $addFields: { landParcels: { $toObjectId: '$landparcel' } } },
        ],
        as: `landParcel${role}`,
      },
    },
    {
      $addFields: {
        [`landParcel${role}`]: {
          $map: {
            input: `$landParcel${role}`,
            in: {
              landParcel: {
                $toObjectId: '$$this.landParcel',
              },
              [role == 'farmers' ? 'farmer' : 'processor']:
                '$$this.' + (role == 'farmers' ? 'farmer' : 'processor'),
              own: '$$this.own',
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: `landParcel${role}.landParcel`,
        foreignField: '_id',
        as: `${role}_landParcels`,
        pipeline: [
          {
            $addFields: {
              lpId: {
                $toString: '$_id',
              },
            },
          },
          { $match: { active: true } },
          {
            $lookup: {
              from: model2collection('events'),
              localField: 'lpId',
              foreignField: 'landParcelId',
              as: 'landParcelEvents',
              pipeline: [
                { $match: { category: 'Submission' } },
                {
                  $sort: { createdAt: -1 },
                },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              surveyNumber: 1,
              address: 1,
              areaInAcres: 1,
              own: 1,
              map: 1,
              status: 1,
              landParcelEvents: 1,
              lpId: 1,
            },
          },
          {
            $lookup: {
              from: model2collection('productionsystems'),
              localField: 'lpId',
              foreignField: 'landParcel',
              pipeline: [
                { $match: { active: true } },
                { $addFields: { fieldObjectId: { $toObjectId: '$field' } } },
                { $addFields: { stringId: { $toString: '$_id' } } },
                {
                  $lookup: {
                    from: model2collection('fields'),
                    localField: 'fieldObjectId',
                    foreignField: '_id',
                    pipeline: [{ $match: { active: true } }],
                    as: 'fieldDetails',
                  },
                },
                {
                  $lookup: {
                    from: model2collection('events'),
                    localField: 'id',
                    foreignField: 'productionSystemId',
                    pipeline: [
                      { $match: { active: true, category: 'Submission' } },
                      { $sort: { createdAt: -1 } },
                    ],
                    as: 'productionSystemEvents',
                  },
                },
                {
                  $lookup: {
                    from: model2collection('poultrybatches'),
                    localField: 'stringId',
                    foreignField: 'productionSystem',
                    pipeline: [
                      { $match: { active: true, productionSystem: { $exists: true } } },
                      { $sort: { createdAt: -1 } },
                    ],
                    as: 'poultrybatches',
                  },
                },
              ],
              as: 'productionSystems',
            },
          },
          // processing systems
          {
            $lookup: {
              from: model2collection('processingsystems'),
              localField: 'lpId',
              foreignField: 'landParcel',
              pipeline: [
                { $match: { active: true } },
                {
                  $addFields: {
                    fieldObjectId: { $toObjectId: '$field' },
                    psid: { $toString: '$_id' },
                  },
                },
                {
                  $lookup: {
                    from: model2collection('fields'),
                    localField: 'fieldObjectId',
                    foreignField: '_id',
                    pipeline: [{ $match: { active: true } }],
                    as: 'fieldDetails',
                  },
                },
                {
                  $lookup: {
                    from: model2collection('events'),
                    localField: 'psid',
                    foreignField: 'processingSystemId',
                    pipeline: [
                      { $match: { active: true, category: 'Submission' } },
                      { $sort: { createdAt: -1 } },
                    ],
                    as: 'processingSystemEvents',
                  },
                },
              ],
              as: 'processingSystems',
            },
          },
        ],
      },
    },

    {
      $lookup: {
        from: model2collection('crops'),
        localField: `${role}Ids.${role}Id`,
        foreignField: 'farmer.id',
        as: `${role}_crops`,
        pipeline: [
          {
            $addFields: {
              fieldId: {
                $toObjectId: '$field',
              },
              croppingSystemId: {
                // $toObjectId: '$croppingSystem',
                $cond: {
                  if: {
                    $regexMatch: {
                      input: '$croppingSystem',
                      regex: /^[0-9a-fA-F]{24}$/, // Check if it's a valid ObjectId format
                    },
                  },
                  then: { $toObjectId: '$croppingSystem' }, // Convert to ObjectId if it's valid
                  else: null,
                },
              },
              cropId: {
                $toString: '$_id',
              },
            },
          },
          { $match: { active: true, status: { $ne: 'Completed' } } },
          {
            $lookup: {
              from: model2collection('fields'),
              localField: 'fieldId',
              foreignField: '_id',
              pipeline: [{ $match: { active: true } }],
              as: 'fields',
            },
          },
          {
            $lookup: {
              from: model2collection('events'),
              localField: 'cropId',
              foreignField: 'cropId',
              as: 'cropEvents',
              pipeline: [
                { $match: { category: 'Submission' } },
                { $addFields: { sortDate: { $toDate: '$createdAt' } } },
                { $sort: { sortDate: -1 } },
              ],
            },
          },
          {
            $lookup: {
              from: model2collection('croppingsystems'),
              localField: 'croppingSystemId',
              foreignField: '_id',
              as: 'croppingSytemData',
            },
          },
        ],
      },
    },
  ];

  const dbResult = await AgentApi.aggregate([
    { $match: { userId: userId } },
    { $addFields: { agentId: { $toString: '$_id' } } },
    ...getRelations('farmers'),
    ...getRelations('processors'),

    {
      $project: {
        agentId: 1,
        personalDetails: 1,
        personalOrgDetails: { orgName: 1, identificationNumber: 1 },
        active: 1,
        farmers_count: 1,
        farmers: {
          _id: 1,
          personalDetails: 1,
          operatorDetails: 1,
          userId: 1,
          collectives: 1,
          type: 1,
        },
        processors_count: 1,
        processors: {
          _id: 1,
          personalDetails: 1,
          operatorDetails: 1,
          userId: 1,
          collectives: 1,
          type: 1,
        },
        // TODO need to make this dynamic based on roles
        landParcelfarmers: 1,
        landParcelprocessors: 1,
        farmers_landParcels: {
          _id: 1,
          name: 1,
          surveyNumber: 1,
          address: 1,
          areaInAcres: 1,
          map: 1,
          status: 1,
          productionSystems: 1,
          processingSystems: 1,
          landParcelEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            landParcelId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            _id: 1,
          },
        },
        farmers_crops: {
          fbId: 1,
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          landParcel: 1,
          croppingSystemId: 1,
          costOfCultivation: 1,
          croppingSystem: 1,
          croppingSytemData: 1,
          seedVariety: 1,
          seedSource: 1,
          plannedSowingDate: 1,
          actualSowingDate: 1,
          category: 1,
          cropType: 1,
          field: 1,
          fieldId: 1,
          fields: {
            _id: 1,
            map: 1,
            name: 1,
            areaInAcres: 1,
            category: 1,
            landParcel: 1,
            status: 1,
          },
          cropEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            cropId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            planId: 1,
            _id: 1,
          },
        },
        processors_landParcels: {
          _id: 1,
          name: 1,
          surveyNumber: 1,
          address: 1,
          areaInAcres: 1,
          map: 1,
          status: 1,
          productionSystems: 1,
          processingSystems: 1,
          landParcelEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            landParcelId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            _id: 1,
          },
        },
        processors_crops: {
          fbId: 1,
          _id: 1,
          name: 1,
          areaInAcres: 1,
          estimatedYieldTonnes: 1,
          landParcel: 1,
          croppingSystemId: 1,
          costOfCultivation: 1,
          croppingSystem: 1,
          croppingSytemData: 1,
          seedVariety: 1,
          seedSource: 1,
          plannedSowingDate: 1,
          actualSowingDate: 1,
          category: 1,
          cropType: 1,
          field: 1,
          fieldId: 1,
          fields: {
            _id: 1,
            map: 1,
            name: 1,
            areaInAcres: 1,
            category: 1,
            landParcel: 1,
            status: 1,
          },
          cropEvents: {
            active: 1,
            audioRecords: 1,
            category: 1,
            createdAt: 1,
            createdBy: 1,
            cropId: 1,
            location: { lat: 1, lng: 1 },
            name: 1,
            notes: 1,
            photoRecords: 1,
            planId: 1,
            _id: 1,
          },
        },
        fields: {
          _id: 1,
          map: 1,
          name: 1,
          areaInAcres: 1,
          category: 1,
          landParcel: 1,
          status: 1,
        },
      },
    },
  ]);
  // Massage the output to the desired format
  // console.log(dbResult?.[0]?.landParcels?.[0]);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult?.map((item: any) => {
      const getProcessedData = (role: string) => {
        return item?.[role]?.map((f: any) => ({
          id: f._id,
          ...f.personalDetails,
          orgDetails: f.operatorDetails,
          primaryPhone: f.personalDetails.primaryPhone?.toString(),
          userId: f.userId,
          collectives: f.collectives,
          type: f.type,
          landParcels: item?.[`${role}_landParcels`]
            .filter((lp: any) =>
              item?.[`landParcel${role}`]?.some(
                (lf: any) =>
                  // TODO: we need to make sure to add conditions if we have more roles in future or we need to change the data structure of the relational collection
                  lf?.[role == 'farmers' ? 'farmer' : 'processor'] === f._id.toString() &&
                  lf.landParcel.toString() === lp._id.toString(),
              ),
            )
            .map((l: any) => ({
              ...l,
              id: l._id,
              own: item?.[`landParcel${role}`].filter(
                (lpf: any) => l._id.toString() === lpf.landParcel.toString(),
              )[0].own,
              landParcelEvents: l.landParcelEvents.map((le: any) => ({
                id: le._id.toString(),
                ts: le.createdAt,
                lat: le.location?.lat,
                lng: le.location?.lng,
                category: le.category,
                eventId: le._id.toString(),
                landParcelId: le.landParcelId,
                image: le.photoRecords,
                audio: le.audioRecords,
                notes: le.notes,
              })),
              crops: item?.[`${role}_crops`]
                ?.filter((c: any) => c.landParcel.id === l._id.toString())
                ?.map((cm: any) => ({
                  ...cm,
                  croppingSytemData: cm?.croppingSytemData?.[0] || {},
                  cropEvents: cm.cropEvents.map((ce: any) => ({
                    id: ce._id.toString(),
                    ts: ce.createdAt,
                    lat: ce.location?.lat,
                    lng: ce.location?.lng,
                    eventId: ce._id.toString(),
                    cropId: ce.cropId,
                    image: ce.photoRecords,
                    audio: ce.audioRecords,
                    notes: ce.notes,
                  })),
                })),
            })),
        }));
      };

      return {
        agentId: item.agentId,
        personalDetails: {
          ...item.personalDetails,
          primaryPhone: item.personalDetails.primaryPhone?.toString(),
        },
        id: item.agentId,
        farmers_count: item?.farmers_count?.[0]?.total || 0,
        processors_count: item?.processors_count?.[0]?.total || 0,
        farmers: getProcessedData('farmers'),
        processors: getProcessedData('processors'),
      };
    });
    return result[0];
  } catch (e) {
    console.log('ERROR in agentMobileHomeQuery:postProcess', e);
  }
};
