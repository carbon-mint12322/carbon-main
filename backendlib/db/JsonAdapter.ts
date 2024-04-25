import fs from 'fs';
import * as R from 'ramda';
import { filter } from 'ramda';
import * as T from './types';
import dbData from './fake-db.json';
import { uuid as idgen } from 'uuidv4';
import makeLogger from '../logger';
import { IUpdateResult } from './types';

const logger = makeLogger('JSONDB');

type GenericDataPayload = any;

let sourceData = dbData;
let jsonDBFile: string | null = null;

const connect = async () => {};
const disconnect = async () => {};

const TENANT_NAME = process.env.TENANT_NAME || 'reactml-dev';

const writeDbFile = () => {
  if (jsonDBFile) fs.writeFileSync(jsonDBFile, JSON.stringify(sourceData, null, 1));
};

const insertMany = (schemaId: string) => {
  return async (data: GenericDataPayload[]) => {
    data.forEach((item: GenericDataPayload) => {
      const id = '' + idgen();
      const tobeInserted = {
        id: item.id || id,
        app: TENANT_NAME,
        schemaId,
        tags: [],
        data: {
          id,
          ...item,
        },
      };
      sourceData = R.append(tobeInserted)(sourceData);
    });
    writeDbFile();
  };
};

const insertOne = (schemaId: string) => {
  return async (item: GenericDataPayload) => {
    const id = '' + idgen();
    const tobeInserted = {
      id: item.id || id,
      app: TENANT_NAME,
      schemaId,
      tags: [],
      data: {
        id,
        ...item,
      },
    };
    sourceData = R.append(tobeInserted)(sourceData);
    writeDbFile();
    return Promise.resolve(null);
  };
};

const findById =
  (schemaId: string) =>
  async (id: string): Promise<GenericDataPayload> =>
    findOne(schemaId)({ id });

const findOne =
  (schemaId: string) =>
  // eslint-disable-next-line
  async (params = {}, options = {}): Promise<GenericDataPayload> => {
    const query: any = filterWithSchemaId(schemaId, params);
    logger.debug('[findOne][filter]', filter);
    const queryResults = await search(query)(sourceData);
    const result = queryResults[0];
    logger.debug('[findOne][status] OK');
    return result;
  };

// eslint-disable-next-line
const findByIdAndUpdate = (_schemaId: string) => {
  return async (id: T.ObjectId, mods: any): Promise<any> => {
    const index = findIndex(id)(sourceData);
    if (index < 0) {
      throw new Error('NO_SUCH_ID');
    }
    const objBefore = sourceData[index];
    const objAfter = {
      ...objBefore,
      data: {
        ...objBefore.data,
        ...mods,
      },
    };
    sourceData = R.update(index, objAfter)(sourceData);
    // logger.debug("before", objBefore, "after", sourceData[index])
    writeDbFile();
    return Promise.resolve(null);
  };
};

const findIndex = (id: string) => (arr: any[]) => {
  // logger.debug("[findIndex] id is ", id)
  const path = ['data', 'id'];
  return R.findIndex(R.pathEq(path, id))(arr);
};

export const search = (query: any) => async (arr: any[]) => {
  logger.debug(' Query obj is ' + JSON.stringify(query));
  const filters = Object.keys(query).map((k: string) => R.pathEq(k.split('.'), query[k]));
  const filterFn = R.filter(R.allPass(filters));
  const rows = filterFn(arr);
  return rows;
};

const find =
  (schemaId: string) =>
  // eslint-disable-next-line
  async (params = {}, _options = {}): Promise<T.IListResult> => {
    await connect();
    const query: any = filterWithSchemaId(schemaId, params);
    logger.debug('[find]', query);
    const results = await search(query)(sourceData);
    logger.debug('[find] OK');
    return results.map((row) => row.data);
  };

const distinct =
  (schemaId: string) =>
  // eslint-disable-next-line
  async (params = {}, _options = {}): Promise<T.IListResult> => {
    await connect();
    const query: any = filterWithSchemaId(schemaId, params);
    logger.debug('[find]', query);
    const results = await search(query)(sourceData);
    logger.debug('[find] OK');
    return results.map((row) => row.data);
  };

const removeById = (schemaId: string) => {
  return async (id: T.ObjectId): Promise<T.IDeleteResult> => {
    const isMatches = (x: any) => x.schemaId === schemaId && x.data.id === id;
    sourceData = R.reject(isMatches, sourceData);
    writeDbFile();
    return Promise.resolve(null);
  };
};

const removeAll = (schemaId: string) => {
  return async (): Promise<T.IDeleteResult> => {
    const isMatches = (x: any) => x.schemaId === schemaId;
    sourceData = R.reject(isMatches, sourceData);
    writeDbFile();
    return Promise.resolve(null);
  };
};

// eslint-disable-next-line
const getMulti = (schemaId: string) => (ids: string[]) => Promise.all(ids.map(findById));

const dummyStartSession = () =>
  Promise.resolve({
    withTransaction: (fn: Function) => Promise.resolve(fn()),
    startTransaction: async () => Promise.resolve(),
    abortTransaction: async () => Promise.resolve(),
    endSession: async () => Promise.resolve(),
  });

const dummyAggregate = (pipeline: any[]): Promise<T.IListResult> => {
  return Promise.reject(new Error('Unsupported'));
};

const dummyUpdateMany = (_schemaId: string) => {
  return async (selection_criteria: object, mods: any): Promise<any> => {
    return Promise.reject(new Error('Unsupported'));
  };
};

const getModel = (schemaId: string): T.IDbModelApi => ({
  create: insertOne(schemaId),
  createMany: insertMany(schemaId),
  get: findById(schemaId),
  getMulti: getMulti(schemaId),
  update: findByIdAndUpdate(schemaId),
  remove: removeById(schemaId),
  removeAll: removeAll(schemaId),
  list: find(schemaId),
  distinctList: distinct(schemaId),
  getByFilter: findOne(schemaId),
  findOne: findOne(schemaId),
  createView: createView,
  startSession: dummyStartSession,
  findOneAtRoot: findOne(schemaId),
  add: findByIdAndUpdate(schemaId),
  addUnique: findByIdAndUpdate(schemaId),
  updateNestedDoc: findByIdAndUpdate(schemaId),
  updateMany: dummyUpdateMany(schemaId),
  aggregate: dummyAggregate,
});

const makeJsonAdapter = (jsonFile: string): T.IDb => {
  jsonDBFile = jsonFile;
  try {
    const jsonstr = fs.readFileSync(jsonFile);
    sourceData = JSON.parse(jsonstr.toString());
  } catch {
    logger.debug('Unable to load JSON DB file. Using default data');
  }
  return {
    connect,
    disconnect,
    getModel,
  };
};

export default makeJsonAdapter;

const addDataPrefix = (query: any = {}) => {
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

const filterWithSchemaId = (schemaId: string, params: any = {}) => ({
  app: TENANT_NAME,
  schemaId,
  ...addDataPrefix(params),
});

// simulate the structure in mongo
// Load from fake-data.json
export const makeJsonDb = (sourceData: any): any[] => {
  const model2SchemaId = (modelName: string) => `/farmbook/${modelName}`;

  const mapObjects = (modelName: string, arr: any[] = []) =>
    arr.map((obj: any) => ({
      app: TENANT_NAME,
      schemaId: model2SchemaId(modelName),
      tags: [],
      ...obj,
    }));
  // map
  const farmers = mapObjects('Farmer', sourceData.farmers);
  const landParcels = mapObjects('LandParcel', sourceData.landParcels);
  const landParcelFields = mapObjects('LandParcelField', sourceData.landParcelFields);
  const operators = mapObjects('Operator', sourceData.operators);
  const users = mapObjects('User', sourceData.users);
  const crops = mapObjects('Crop', sourceData.crops);

  return [...farmers, ...landParcels, ...landParcelFields, ...operators, ...users, ...crops];
};

type LFPair = [any, any]; // Local/foreign pair

/**
 * This function does a join of two arrays of data, each representing a schema collection.
 * Objects are selected where local.localField matches foreign.foreignField.
 *
 * @param viewDef - defines how to make the join
 * @param localObjects - list of "from" objects
 * @param foreignObjects - list of "foreign" objects
 * @returns joined objects
 */
export const innerJoin = (viewDef: T.ViewDef, localObjects: any[], foreignObjects: any[]) => {
  // create a "product" tuples - all combinations of the two arrays
  const xproduct = R.xprod(localObjects, foreignObjects);
  // filter tuples, where the joins match
  const objects = xproduct
    .filter(
      ([local, foreign]: LFPair) =>
        local.data[viewDef.localField] === foreign.data[viewDef.foreignField],
    )
    // merge the tuple
    .map(([local, foreign]: LFPair) => ({
      ...local,
      data: {
        ...local.data,
        [viewDef.foreignObjectName]: foreign.data,
      },
    }));
  return objects;
};

const createView = (viewDef: T.ViewDef) => {
  const localApi = getModel(viewDef.fromSchemaId);
  const foreignApi = getModel(viewDef.foreignSchemaId);
  const list = async (query: any): Promise<T.IListResult> => {
    const localObjects = await localApi.list({ ...query });
    const foreignObjects = await foreignApi.list({});

    return Promise.resolve(innerJoin(viewDef, localObjects, foreignObjects));
  };
  return { list };
};

export const innerJoinTest = () => {
  const viewDef: T.ViewDef = {
    localField: 'farmerId',
    fromSchemaId: '/farmbook/crop',
    foreignField: 'id',
    foreignSchemaId: '/farmbook/farmer',
    projection1: { cropName: true },
    projection2: { name: true },
    foreignObjectName: 'farmer',
  };
  const crops = [
    { id: 1, schemaId: '/farmbook/crop', data: { cropName: 'crop1', id: 'c1', farmerId: 'f1' } },
    { id: 2, schemaId: '/farmbook/crop', data: { cropName: 'crop2', id: 'c2', farmerId: 'f2' } },

    // this does not point to any farmer in the farmer array,
    // so should not be in output
    { id: 6, schemaId: '/farmbook/crop', data: { cropName: 'crop3', id: 'c3', farmerId: 'f4' } },
  ];
  const farmers = [
    { id: 3, schemaId: '/farmbook/farmer', data: { id: 'f1', name: 'farmer1' } },
    { id: 4, schemaId: '/farmbook/farmer', data: { id: 'f2', name: 'farmer2' } },

    // This is not pointed to, by any crop, so should not be returned in the output
    { id: 5, schemaId: '/farmbook/farmer', data: { id: 'f3', name: 'farmer3' } },
  ];

  return innerJoin(viewDef, crops, farmers);
};
