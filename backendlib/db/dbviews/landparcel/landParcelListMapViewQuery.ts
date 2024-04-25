const mongoose = require('mongoose');
import MongoAdapter from '../../MongoAdapter';
import { model2schemaId } from '../util';

const LP_SCHEMA_ID = model2schemaId('landparcel');
const LPApi = MongoAdapter.getModel(LP_SCHEMA_ID);

export const landParcelListMapViewQuery = async (filter = {}, collectiveId?: string) => {
  const dbResult = await LPApi.aggregate([
    { $match: { ...filter, collective: collectiveId } },
    { $addFields: { landParcelId: { $toString: '$_id' } } },
    {
      $project: {
        name: 1,
        map: 1,
      },
    },
  ]);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item.landParcelId,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in landParcelMapListViewQuery:postProcess', e);
  }
};
