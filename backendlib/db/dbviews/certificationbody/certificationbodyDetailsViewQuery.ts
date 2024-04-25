const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const CB_SCHEMA_ID = model2schemaId('certificationbody');
const CBApi = MongoAdapter.getModel(CB_SCHEMA_ID);

export const certificationbodyDetailsViewQuery = async (certificationbodyId: any) => {
  const dbResult = await CBApi.aggregate([
    { $match: { _id: new ObjectId(certificationbodyId) } },
    { $addFields: { certificationbodyId: { $toString: '$_id' } } },


    {
      $project: {
        certificationbodyId: 1,
        name: 1,
        slug: 1,
        schemes: 1,
        address: 1,
        email: 1,
        poc: 1,
        users: 1,
        phone: 1,
        certificationAuthority: 1,
        registrationDocumentFile: 1,
        documents: 1,
        history: 1
      },
    },
  ]);
  // Massage the output to the desired format
  //console.log('DB Result for poultry query', dbResult, POULTRY_SCHEMA_ID);
  return postProcess(dbResult);
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
    }));
    return JSON.parse(JSON.stringify(result?.[0]));
  } catch (e) {
    console.log('ERROR certificationbodyDetailsViewQuery:postProcess', e);
  }
};
