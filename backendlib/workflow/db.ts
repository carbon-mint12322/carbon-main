import { WorkflowInstance as WfInst } from './types';
import * as T from './types';

import { getDbAdapter } from '../db/adapter';
import { IDbTransactionSession } from '../db/types';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

export const getWfDbApi = () => {
  const wfDefSchemaId = T.wfDefSchemaId;
  const wfInstSchemaId = T.wfInstSchemaId;

  const dbAdapter = getDbAdapter();
  const wfInstDbApi = dbAdapter.getModel(wfInstSchemaId);
  const wfDefDbApi = dbAdapter.getModel(wfDefSchemaId);

  const dbUpdateInstance = async (wf: WfInst, dbSession: IDbTransactionSession, userId: string) => {
    return wfInstDbApi.update(
      wf.id,
      { domainObjectId: wf.domainObjectId, state: wf.state, updatedAt: dayjs().toISOString() },
      userId,
      dbSession,
    );
  };

  const dbLoadInstance = async (id: string) => wfInstDbApi.get(id);
  const dbCreateInstance = (input: any, dbSession: IDbTransactionSession, userId: string) => {
    const { dbSession: _ignore, ...data } = input;
    const dbInput = { _id: new ObjectId(data.id), ...data };
    return wfInstDbApi.create(dbInput, userId, dbSession);
  };
  const startSession = wfInstDbApi.startSession; // for db transactions

  return {
    dbCreateInstance,
    dbLoadInstance,
    dbUpdateInstance,
    startSession,
  };
};
export const getDomainDbApi = (domainSchemaId: string) => {
  const dbAdapter = getDbAdapter();
  const domainDbApi = dbAdapter.getModel(domainSchemaId);
  const load = async (id: string) => {
    return domainDbApi.get(id);
  };
  const update = domainDbApi.update;

  return {
    load,
    update,
  };
};
