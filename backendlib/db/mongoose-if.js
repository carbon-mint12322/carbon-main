const mongoose = require('mongoose');
const { Schema } = mongoose;
const { connectDB, disconnectDB } = require('./connection');
import { ObjectId } from 'mongodb';
import makeLogger from '../logger';
import prefixObjectKeys from '~/utils/prefixObjectKeys';

const logger = makeLogger('MONGO');

const TENANT_NAME = process.env.TENANT_NAME || 'reactml-dev';

const genericObjectSchema = new Schema(
  {
    app: String,
    schemaId: String,
    ddcId: String,
    data: mongoose.Mixed,
    tags: [mongoose.Mixed],
  },
  { timestamps: true },
);

const genericObjectSchema2 = new Schema(
  {
    data: mongoose.Mixed,
  },
  { timestamps: true },
);
const GenericModel =
  mongoose.models.GenericObject || mongoose.model('GenericObject', genericObjectSchema);

const getModel = (schemaId) => {
  const collName = `/${TENANT_NAME}${schemaId}`;
  return mongoose.models[collName] || mongoose.model(collName, genericObjectSchema2);
};

const getRootModel = (schemaId) => {
  const collName = `${schemaId}`;
  return mongoose.models[collName] || mongoose.model(collName, genericObjectSchema2);
};

const addDataPrefix = (query = {}) => {
  return Object.keys(query)
    .map((key) => [key, 'data.' + key])
    .reduce(
      (acc, [oldkey, newkey]) => ({
        ...acc,
        [newkey]: query[oldkey],
      }),
      {},
    );
};

const itemWithSchemaId = (schemaId, item) => ({
  ...item,
});

const itemsWithSchemaId = (schemaId, items = []) =>
  items.map((item) => itemWithSchemaId(schemaId, item));

// Removes objects within the app scope
const cleanupGenericObjects = async (app) => {
  if (!app) {
    throw new Error('cleanupGenericObjects requires app name');
  }
  return GenericModel.deleteMany({ app });
};

// Options has projections, limits etc
export const find = (schemaId) => {
  const Model = getModel(schemaId);
  return async (params = {}, options = {}) => {
    logger.debug(`find ${schemaId}`);
    const query = addDataPrefix(params);
    logger.debug('[find]', query);
    const results = await Model.find(query, options);
    logger.debug('[find] OK');
    return results;
  };
};

// Options has projections, limits etc
export const findNoDataObject = (schemaId) => {
  const Model = getModel(schemaId);
  return async (params = {}, options = {}) => {
    logger.debug(`find ${schemaId}`);
    const query = params;
    logger.debug('[find]', query);
    const results = await Model.collection.find(query, options).toArray();
    logger.debug('[find] OK');
    return results;
  };
};

// Options has projections, limits etc
export const findDistinctDataObject = (schemaId) => {
  const Model = getModel(schemaId);
  return async (field, params = {}) => {
    logger.debug(`find distinct ${field} field in ${schemaId}`);
    const query = params;
    logger.debug('[find]', query);
    const results = await Model.collection.distinct(field, query);
    logger.debug('[find] OK');
    return results;
  };
};

export const findById = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id) => {
    try {
      const result = await Model.findById(new ObjectId(id));
      return result.toObject();
    } catch (err) {
      console.error(`findById failed for Schema: ${schemaId} for id: ${id} `, err);
      throw err;
    }
  };
};

// For now. This will result in multiple queries, and should be
// replaced with a single query
export const findByIdMulti = (schemaId) => (ids) => Promise.all(ids.map(findById));

export const findOne = (schemaId) => {
  const Model = getModel(schemaId);
  return async (params = {}, options = {}) => {
    const filter = addDataPrefix(params);
    logger.debug('[findOne][filter]', filter);
    try {
      const result = await Model.collection.findOne(filter, options);
      logger.debug('[findOne][status] OK');
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
};

export const findOneNoDataObject = (schemaId) => {
  const Model = getModel(schemaId);
  return async (params = {}, options = {}) => {
    const filter = params;
    logger.debug('[findOne][filter]', filter);
    const result = await Model.collection.findOne(filter, options);
    logger.debug('[findOne][status] OK');
    return result;
  };
};

export const findOneAtRoot = (schemaId) => {
  const Model = getRootModel(schemaId);
  return async (params = {}, options = {}) => {
    const filter = params;
    logger.debug('[findOneRoot][filter]', filter);
    const result = await Model.collection.findOne(filter, options);
    logger.debug('[findOneRoot][status] OK');
    return result;
  };
};

const findOneById = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return Model.findOne(id);
    }
    return null;
  };
};

export const insertMany = (schemaId) => {
  const Model = getModel(schemaId);
  return async (items = [], session) => {
    // console.log(`[${schemaId}] Inserting ${items.length} records`, session);
    return Model.collection.insertMany(items, { session });
  };
};

export const insertOne = (schemaId) => {
  const Model = getModel(schemaId);
  return async (item, userId, session) => {
    const insertResult = await Model.collection.insertOne(
      { ...item, active: true, createdAt: new Date().toISOString(), createdBy: userId },
      { session },
    );
    return insertResult;
  };
};

const findOneAndUpdate = (schemaId) => {
  const Model = getModel(schemaId);
  return (findCriteria = {}) => {
    return async (updateCriteria = {}, session) => {
      return Model.findOneAndUpdate(
        addDataPrefix(findCriteria),
        { $set: updateCriteria },
        { new: true, session },
      );
    };
  };
};

export const findByIdAndUpdate = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id, mods, userId, session) => {
    const oid = new ObjectId(id);
    logger.debug('updating object: (' + schemaId + ',' + oid + ')');
    if (mongoose.Types.ObjectId.isValid(oid)) {
      const snapshot = await Model.findById(oid);
      const result = await Model.collection.updateOne(
        { _id: oid },
        { $set: mods },
        { new: true, session },
      );
      logger.debug('DB Update complete');
      // add history
      const HistoryModel = getModel('/farmbook/history');
      await HistoryModel.collection.insertOne(
        {
          relatedTo: { objectId: id, schemaId },
          snapshot,
          modifications: mods,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          active: true,
        },
        { session },
      );
      logger.debug('DB History Update complete');
      return result;
    } else {
      console.error('Invalid id: ' + id.toString());
      throw new Error('Invalid id: ' + id.toString());
    }
  };
};

export const findByIdAndAdd = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id, mods, userId, session) => {
    const oid = new ObjectId(id);
    logger.debug('updating object: (' + schemaId + ',' + oid + ')');
    if (mongoose.Types.ObjectId.isValid(oid)) {
      const snapshot = await Model.findById(oid);
      const result = await Model.collection.updateOne(
        { _id: oid },
        { $push: mods },
        { new: true, session },
      );
      logger.debug('DB Update complete');
      // add history
      const HistoryModel = getModel('/farmbook/history');
      await HistoryModel.collection.insertOne(
        {
          relatedTo: { objectId: id, schemaId },
          snapshot,
          modifications: mods,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          active: true,
        },
        { session },
      );
      logger.debug('DB History Update complete');
      return result;
    } else {
      console.error('Invalid id: ' + id.toString());
      throw new Error('Invalid id: ' + id.toString());
    }
  };
};

export const findByIdAndAddUnique = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id, mods, session) => {
    const oid = new ObjectId(id);
    logger.debug('updating object: (' + schemaId + ',' + oid + ')');
    if (mongoose.Types.ObjectId.isValid(oid)) {
      const result = await Model.collection.updateOne(
        { _id: oid },
        { $addToSet: mods },
        { new: true, session },
      );
      logger.debug('DB Update complete');
      return result;
    } else {
      console.error('Invalid id: ' + id.toString());
      throw new Error('Invalid id: ' + id.toString());
    }
  };
};

export const findByIdAndUpdateNestedDocByQuery = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id, nestedParamName, nestedDocFindQuery, newNestedDocObj, userId, session) => {
    const oid = new ObjectId(id);
    logger.debug('updating object: (' + schemaId + ',' + oid + ')');
    if (mongoose.Types.ObjectId.isValid(oid)) {
      const subquery = prefixObjectKeys({
        prefix: nestedParamName,
        obj: nestedDocFindQuery,
      });

      const newNestedDocFormatted = prefixObjectKeys({
        prefix: nestedParamName + '.$',
        obj: newNestedDocObj,
      });
      const snapshot = await Model.findById(oid);
      const result = await Model.collection.updateOne(
        { _id: oid, ...subquery },
        { $set: newNestedDocFormatted },
        { new: true, session },
      );
      logger.debug('DB Update complete');
      // add history
      const HistoryModel = getModel('/farmbook/history');
      await HistoryModel.collection.insertOne(
        {
          relatedTo: { objectId: id, schemaId },
          snapshot,
          modifications: newNestedDocFormatted,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          active: true,
        },
        { session },
      );
      logger.debug('DB History Update complete');
      return result;
    } else {
      console.error('Invalid id: ' + id.toString());
      throw new Error('Invalid id: ' + id.toString());
    }
  };
};

export const update = (schemaId) => {
  const Model = getModel(schemaId);
  return (findCriteria = {}) => {
    return async (updateCriteria = {}, session) => {
      return Model.updateMany(
        addDataPrefix(findCriteria),
        { $set: updateCriteria },
        { new: true, multi: true, session },
      );
    };
  };
};

export const updateMany = (schemaId) => {
  const Model = getModel(schemaId);
  return async (findCriteria = {}, updateCriteria = {}, userId, session) => {
    var snapshots = await Model.collection.find(findCriteria, {});
    snapshots = [...(await snapshots.toArray())];
    const result = await Model.collection.updateMany(
      findCriteria,
      { $set: updateCriteria },
      { new: true, multi: true, session },
    );
    logger.debug('DB Update complete');
    const data = snapshots.map((ss) => ({
      relatedTo: { objectId: ss._id.toString(), schemaId },
      snapshot: ss,
      modifications: updateCriteria,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      active: true,
    }));
    // add history
    const HistoryModel = getModel('/farmbook/history');
    await HistoryModel.collection.insertMany(data, { session });
    logger.debug('DB History Update complete');
    return result;
  };
};

const updateOne = (schemaId) => {
  const Model = getModel(schemaId);
  return (findCriteria = {}) => {
    return async (updateCriteria = {}, session) => {
      return Model.updateOne(
        addDataPrefix(findCriteria),
        { $set: updateCriteria },
        { new: true, multi: true, session },
      );
    };
  };
};

const remove = (schemaId) => {
  const Model = getModel(schemaId);
  return async (findCriteria = {}, session) => {
    const filter = addDataPrefix(findCriteria);
    return Model.collection.deleteMany(filter, { session });
  };
};

export const removeByFilter = remove;

export const removeById = (schemaId) => {
  const Model = getModel(schemaId);
  return async (id, session) => {
    return Model.collection.deleteOne({ _id: new ObjectId(id) }, { session });
  };
};

const findOneAndRemove = (schemaId) => {
  const Model = getModel(schemaId);
  return async (findCriteria = {}, session) => {
    return Model.findOneAndRemove(addDataPrefix(findCriteria), { session });
  };
};

export const startSession = (schemaId) => {
  const Model = getModel(schemaId);
  return () => Model.startSession();
};

export const aggregate = (schemaId) => {
  const Model = getModel(schemaId);
  return (pipeline) => Model.aggregate(pipeline);
};

export const queryView = async (
  from,
  localField,
  foreignSchema,
  foreignField,
  projection1,
  projection2,
) => {
  const localApi1 = {};
  const foreignApi2 = {};
};

module.exports = {
  getModel,

  connectDB,
  disconnectDB,

  updateMany,

  insertOne,
  insertMany,
  findById,
  findByIdMulti,
  find,
  findNoDataObject,
  findDistinctDataObject,
  findOne,
  findOneNoDataObject,
  findOneAtRoot,
  findByIdAndUpdate,
  findByIdAndAdd,
  findByIdAndAddUnique,
  findByIdAndUpdateNestedDocByQuery,
  removeById,
  removeByFilter,

  startSession,

  aggregate,

  // handle with care
  cleanupGenericObjects,
  /*
    findOneById,
    save,
    findOneAndUpdate,
    update,
    updateOne,
    remove,
    findOneAndRemove,
*/
};
