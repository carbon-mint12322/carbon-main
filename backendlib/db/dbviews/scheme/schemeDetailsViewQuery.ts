const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const SCHEME_SCHEMA_ID = model2schemaId('scheme');
const SchemeApi = MongoAdapter.getModel(SCHEME_SCHEMA_ID);

export const schemeDetailsViewQuery = async (schemeId: any) => {
  const dbResult = await SchemeApi.aggregate([
    { $match: { _id: new ObjectId(schemeId) } },
    { $addFields: { schemeId: { $toString: '$_id' } } },
    {
      $lookup: {
        from: model2collection('plans'),
        localField: 'schemeId',
        foreignField: 'schemeId',
        pipeline: [{ $match: { active: true } }],
        as: 'plan',
      },
    },
    { $addFields: { cbObjectId: { $toObjectId: '$certificationBodyId' } } },
    {
      $lookup: {
        from: model2collection('certificationbodies'),
        localField: 'cbObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'certificationbodies',
      },
    },
    { $addFields: { certificationbody: { $arrayElemAt: ['$certificationbodies', 0] } } },
    { $addFields: { schemeOwnerObjectId: { $toObjectId: '$schemeOwner' } } },
    {
      $lookup: {
        from: model2collection('farmers'),
        localField: 'schemeOwnerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'farmers',
      },
    },
    { $addFields: { farmer: { $arrayElemAt: ['$farmers', 0] } } },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'schemeOwnerObjectId',
        foreignField: '_id',
        pipeline: [{ $match: { active: true } }],
        as: 'collectives',
      },
    },
    { $addFields: { collectiive: { $arrayElemAt: ['$collectives', 0] } } },
    {
      $project: {
        schemeId: 1,
        fbId: 1,
        certificationBodyId: 1,
        scheme: 1,
        registrationDate: 1,
        conversionStatus: 1,
        certificationStatus: 1,
        certificationDocument: 1,
        validityStartDate: 1,
        certificationAuthority: 1,
        farmers: 1,
        collectives: 1,
        certificationbodies: 1,
        farmer: 1,
        collective: 1,
        certificationbody: 1,
        schemeOwner: 1,
        ownerType: 1,
        plan: { _id: 1, name: 1, events: 1, category: 1, createdBy: 1, status: 1 },
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log("dbResult", dbResult);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => {
      return {
        ...item,
        id: item.schemeId,
        entityProgress: {
          plan: {
            id: item.plan[0]?._id,
            name: item.plan[0]?.name,
            events: item.plan[0]?.events,
          },
        },
        collectives: item.collectives.map((c: any) => ({ ...c, id: c._id })),
        farmers: item.farmers.map((f: any) => ({ ...f, id: f._id })),
        certificationbodies: item.certificationbodies.map((cb: any) => ({ ...cb, id: cb._id })),
      };
    });
    //console.log("dbResult", result);
    //return JSON.parse(JSON.stringify(result));
    return JSON.parse(JSON.stringify(result[0]));
  } catch (e) {
    console.log('ERROR in schemeDetailsViewQuery:postProcess', e);
  }
};
