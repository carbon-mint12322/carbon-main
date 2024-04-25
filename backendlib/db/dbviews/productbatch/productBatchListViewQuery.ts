const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PRODUCT_BATCH_SCHEMA_ID = model2schemaId('productbatch');
const ProductBatchApi = MongoAdapter.getModel(PRODUCT_BATCH_SCHEMA_ID);

export const productBatchListViewQuery = async (filter = {}, collectiveId?: string, options?: any) => {
  const dbResult = await ProductBatchApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { productBatchStringId: { $toString: '$_id' } } },
    { $addFields: { productObjectId: { $toObjectId: '$product' } } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    {
      $lookup: {
        from: model2collection('products'),
        localField: 'productObjectId',
        foreignField: '_id',
        as: 'products',
      },
    },
    { $addFields: { productItem: { $arrayElemAt: ['$products', 0] } } },
    {
      $lookup: {
        from: model2collection('events'),
        localField: 'productBatchStringId',
        foreignField: 'details.productBatch',
        as: 'events',
        pipeline: [{ $match: { status: { $ne: 'archived' } } }],
      },
    },
    {
      $project: {
        _id: 1,
        batchId: 1,
        startDate: 1,
        endDate: 1,
        active: 1,
        status: 1,
        events: { _id: 1 },
        productItem: { name: 1, productId: 1, category: 1, type: 1 },
      },
    },
  ]);
  // Massage the output to the desired format
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
      name: item.batchId,
      hasEvents: item.events?.length > 0,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in productBatchListViewQuery:postProcess', e);
  }
};
