const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const N_SCHEMA_ID = model2schemaId('notification');
const NApi = MongoAdapter.getModel(N_SCHEMA_ID);

export const mobileNotificationListViewQuery = async (filter: any = {}, options?: any) => {
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
    { $addFields: { objOfOperators: { $arrayElemAt: ['$recieverDetails.roles', 0] } } },
    { $addFields: { notificationId: { $toString: '$_id' } } },
    { $addFields: { relatedToObjectId: { $toObjectId: '$relatedTo.objectId' } } },
    {
      $lookup: {
        from: model2collection('crops'),
        localField: 'relatedToObjectId',
        foreignField: '_id',
        as: 'cropDetails',
      },
    },
    { $addFields: { crop: { $arrayElemAt: ['$cropDetails', 0] } } },
    {
      $lookup: {
        from: model2collection('poultrybatches'),
        localField: 'relatedToObjectId',
        foreignField: '_id',
        as: 'poultryDetails',
      },
    },
    { $addFields: { poultry: { $arrayElemAt: ['$poultryDetails', 0] } } },
    {
      $lookup: {
        from: model2collection('aquacrops'),
        localField: 'relatedToObjectId',
        foreignField: '_id',
        as: 'aquaCropDetails',
      },
    },
    { $addFields: { aquaCrop: { $arrayElemAt: ['$aquaCropDetails', 0] } } },
    {
      $addFields: {
        currentOperatorValue: filter.orgSlug,
      },
    },
    {
      $project: {
        objOfOperators: 1,
        recieverDetails: 1,
        notificationId: 1,
        sender: 1,
        receiver: 1,
        currentOperatorValue: 1,
        category: 1,
        status: 1,
        message: 1,
        link: 1,
        relatedTo: 1,
        createdAt: 1,
        readAt: 1,
        active: 1,
        events: { cropId: 1, landParcelId: 1 },
        landParcel: { name: 1 },
        crop: { name: 1, landParcel: { name: 1 } },
        poultry: { batchIdName: 1, landParcel: { name: 1 } },
        aquaCrop: { cropType: 1, landParcel: { name: 1 } },
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
