import { IDb } from './types';
import * as T from './types';
import {
  insertOne,
  insertMany,
  find,
  update,
  findOne,
  findByIdAndUpdate,
  findById,
  findByIdMulti,
  removeById,
  removeByFilter,
  startSession,
  aggregate,
  findOneNoDataObject,
  findNoDataObject,
  findOneAtRoot,
  findByIdAndAdd,
  findByIdAndUpdateNestedDocByQuery,
  findDistinctDataObject,
  updateMany,
  findByIdAndAddUnique,
} from './mongoose-if';
import { connectDB, disconnectDB } from './connection';

const removeAll = (schemaId: string) => (): Promise<T.IDeleteResult> => {
  // untested code, to be tested below
  // eslint-disable-next-line
  return removeByFilter(schemaId)({});
};

//
const makeModelApi = (schemaId: string): T.IDbModelApi => ({
  create: insertOne(schemaId),
  createMany: insertMany(schemaId),
  get: findById(schemaId),
  getMulti: findByIdMulti(schemaId),
  update: findByIdAndUpdate(schemaId),
  updateMany: updateMany(schemaId),
  remove: removeById(schemaId),
  add: findByIdAndAdd(schemaId),
  addUnique: findByIdAndAddUnique(schemaId),
  updateNestedDoc: findByIdAndUpdateNestedDocByQuery(schemaId),

  // Be careful with this, untested function
  removeAll: removeAll(schemaId),

  list: findNoDataObject(schemaId),
  distinctList: findDistinctDataObject(schemaId),
  getByFilter: findOneNoDataObject(schemaId),
  findOne: findOne(schemaId),
  findOneAtRoot: findOneAtRoot(schemaId),
  createView: createView,
  startSession: startSession(schemaId),

  // Mongo aggregate query
  aggregate: aggregate(schemaId),
});

const mongoAdapter: IDb = {
  connect: connectDB,
  disconnect: disconnectDB,
  getModel: makeModelApi,
};

const createView = (viewDef: T.ViewDef) => {
  // untested code, to be tested below
  const localApi = makeModelApi(viewDef.fromSchemaId);
  // eslint-disable-next-line
  const foreignApi = makeModelApi(viewDef.fromSchemaId);

  const list = (): Promise<T.IListResult> => {
    return Promise.reject(new Error('TBD'));
  };
  return { list };
};

export default mongoAdapter;
