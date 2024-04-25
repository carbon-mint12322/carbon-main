import { IDb, IDbModelApi } from './types';
import mongoAdapter from './MongoAdapter';
import makeJsonDbAdapter from './JsonAdapter';

export const getModel = (schemaId: string): IDbModelApi => getDbAdapter().getModel(schemaId);

export const connectDB = () => getDbAdapter().connect();
export const disconnectDB = () => getDbAdapter().disconnect();

export const getDbAdapter = (): IDb => adapter;

// For testing purposes
export const setDbAdapter = (_adapter: IDb): IDb => (adapter = _adapter);

let adapter: IDb = mongoAdapter; // default
if (process.env.MOCK_JSON_DB_ADAPTER) {
  setDbAdapter(makeJsonDbAdapter(process.env.MOCK_JSON_DB_ADAPTER));
  console.log('JSON DB adapter set');
}
