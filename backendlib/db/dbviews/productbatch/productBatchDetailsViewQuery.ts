const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const PRODUCT_BATCH_SCHEMA_ID = model2schemaId('productbatch');
const ProductBatchApi = MongoAdapter.getModel(PRODUCT_BATCH_SCHEMA_ID);

export const productBatchDetailsViewQuery = async (productBatchId: any) => {
  const dbResult = await ProductBatchApi.aggregate([
    { $match: { _id: new ObjectId(productBatchId) } },
    { $addFields: { productBatchStringId: { $toString: '$_id' } } },
    { $addFields: { productObjectId: { $toObjectId: '$product' } } },
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
        foreignField: 'details.productBatch.id',
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
        ],
      },
    },
    {
      $addFields: {
        eventLandParcels: {
          $map: {
            input: '$events',
            in: {
              landParcel: {
                $toObjectId: '$$this.landParcelId',
              },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'eventLandParcels.landParcel',
        foreignField: '_id',
        as: 'landparcels',
      },
    },
    {
      $project: {
        _id: 1,
        landparcels: 1,
        status: 1,
        validationWorkflowId: 1,
        product: 1,
        batchId: 1,
        areaInAcres: 1,
        information: 1,
        startDate: 1,
        endDate: 1,
        documents: 1,
        events: {
          _id: 1,
          name: 1,
          category: 1,
          createdBy: 1,
          createdAt: 1,
          location: 1,
          photoRecords: 1,
          processingSystemId: 1,
          startDate: 1,
          endDate: 1,
          details: 1,
          landParcelId: 1,
          users: { _id: 1, personalDetails: { firstName: 1, lastName: 1 } },
        },
        productItem: { name: 1, productId: 1, category: 1, type: 1 },
        qrLink: 1,
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
      })),
      landparcels: item.landparcels?.map((l: any) => ({ ...l, id: l._id })),
    }));
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR in productBatcDetailsViewQuery:postProcess', e);
  }
};
