const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const N_SCHEMA_ID = model2schemaId('notification');
const NApi = MongoAdapter.getModel(N_SCHEMA_ID);

export const notificationListViewQuery = async (filter: any = {}, options?: any) => {
  const dbResult = await NApi.aggregate([
    { $match: { category: filter?.category } },
    { $addFields: { sortDate: { $toDate: '$createdAt' } } },
    { $sort: { sortDate: -1 } },
    options,
    {
      $lookup: {
        from: model2collection('users'),
        localField: 'receiver',
        foreignField: '_id',
        as: 'recieverDetails',
      },
    },
    {
      $addFields: {
        currentOperatorValue: filter.orgSlug,
      },
    },

    { $addFields: { objOfOperators: { $arrayElemAt: ['$recieverDetails.roles', 0] } } },

    { $addFields: { notificationId: { $toString: '$_id' } } },
    { $addFields: { relatedToObjectId: { $toObjectId: '$relatedTo.objectId' } } },

    {
      $lookup: {
        from: model2collection('events'),
        localField: 'relatedToObjectId',
        foreignField: '_id',
        as: 'events',
      },
    },
    { $addFields: { event: { $arrayElemAt: ['$events', 0] } } },
    { $addFields: { cropOjectId: { $toObjectId: '$event.cropId' } } },
    { $addFields: { landParcelOjectId: { $toObjectId: '$event.landParcelId' } } },
    { $addFields: { productionSystemObjectId: { $toObjectId: '$event.productionSystemId' } } },
    { $addFields: { processingSystemObjectId: { $toObjectId: '$event.processingSystemId' } } },

    {
      $lookup: {
        from: model2collection('landparcels'),
        localField: 'landParcelOjectId',
        foreignField: '_id',
        as: 'landparcels',
      },
    },
    { $addFields: { landParcel: { $arrayElemAt: ['$landparcels', 0] } } },

    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'cropOjectId',
        foreignField: '_id',
        as: 'cropDetails',
      },
    },
    {
      $lookup: {
        from: model2collection('productionsystems'),
        localField: 'productionSystemObjectId',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              productionSystemLandparcelObjectId: {
                $toObjectId: '$landParcel',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('landparcels'),
              localField: 'productionSystemLandparcelObjectId',
              foreignField: '_id',
              as: 'landparcel',
            },
          },
        ],
        as: 'productionSystem',
      },
    },

    {
      $lookup: {
        from: model2collection('processingsystems'),
        localField: 'processingSystemObjectId',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              processingSystemLandparcelObjectId: {
                $toObjectId: '$landParcel',
              },
            },
          },
          {
            $lookup: {
              from: model2collection('landparcels'),
              localField: 'processingSystemLandparcelObjectId',
              foreignField: '_id',
              as: 'landparcel',
            },
          },
        ],
        as: 'processingSystem',
      },
    },

    { $addFields: { crop: { $arrayElemAt: ['$cropDetails', 0] } } },

    {
      $project: {
        recieverDetails: 1,
        notificationId: 1,
        sender: 1,
        receiver: 1,
        objOfOperators: 1,
        currentOperatorValue: 1,
        category: 1,
        status: 1,
        productionSystem: { name: 1, category: 1, landparcel: { name: 1 } },
        processingSystem: { name: 1, category: 1, landparcel: { name: 1 } },
        message: 1,
        link: 1,
        relatedTo: 1,
        createdAt: 1,
        readAt: 1,
        active: 1,
        events: { cropId: 1, landParcelId: 1 },
        landParcel: { name: 1 },
        crop: { name: 1, landParcel: { name: 1 }, fbId: 1, field: 1, cropTag: 1 },
      },
    },
  ]);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.notificationId,
      recieverRoles: item?.objOfOperators?.[item.currentOperatorValue],
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in notificationListViewQuery:postProcess', e);
  }
};
