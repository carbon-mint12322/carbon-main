const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const COLLECTIVE_TC_SCHEMA_ID = model2schemaId('transactioncertificates');
const CollectiveTCApi = MongoAdapter.getModel(COLLECTIVE_TC_SCHEMA_ID);

export const collectiveTransactionCertDetailsViewQuery = async (collectiveTCId: any) => {
  const dbResult = await CollectiveTCApi.aggregate([
    { $match: { _id: ObjectId(collectiveTCId) } },
    { $addFields: { collectiveTCId: { $toString: '$_id' } } },
    {
      $addFields: {
        collectiveObjectId: {
          $toObjectId: '$collective',
        },
      },
    },
    {
      $lookup: {
        from: model2collection('collectives'),
        localField: 'collectiveObjectId',
        foreignField: '_id',
        as: 'collectives',
      },
    },
    {
      $project: {
        _id: 1,
        fbId: 1,
        cb: 1,
        collective: 1,
        aggregationPlan: 1,
        tcId: 1,
        lotNo: 1,
        status: 1,
        collectives: 1,
        validationWorkflowId: 1,
        qrLink : 1
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
        collectives: item.collectives.map((c: any) => ({ ...c, id: c._id })),
      };
    });
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR collectiveTransactionCertDetailsViewQuery:postProcess', e);
  }
};
