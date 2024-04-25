import { ObjectId } from 'mongodb';
import { IDbModelApi } from '../db/types';

export type ModelParams = {
  schema: string;
  model: IDbModelApi;
  validator: any;
  uiSchema: string;
  childResourceParamName: string;
  createFn?: (data: any, parentId: string) => Promise<void>;
};

export type DefaultReturnParams = ModelParams & {
  parentId: string;
};

/** */
type CreateParams<T> = DefaultReturnParams & {
  child: {
    _id: ObjectId;
  } & T;
};

/** */
type UpdateParams<T> = CreateParams<T>;

/** Fetch individual item */
type ReadParams<T = any> = CreateParams<T>;

/** */
export type DeleteParams<T> = ReadParams<T>;

export type Handler<T, R> = {
  before: () => Promise<CreateParams<T> | UpdateParams<T> | ReadParams<T> | DeleteParams<T>>;
  after: () => Promise<R>;
};
