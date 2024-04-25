import MongoAdapter from '../backendlib/db/MongoAdapter';
import makeJsonAdapter from '../backendlib/db/JsonAdapter';
import { IDbModelApi } from '../backendlib/db/types';

const fakeDb = './backend/db/fakedb.json';
const JsonAdapter = makeJsonAdapter(fakeDb);

const schemaNames = [
  '/farmbook/crop',
  '/farmbook/cropList',
  '/farmbook/event',
  '/farmbook/farmer',
  '/farmbook/farmerList',
  '/farmbook/field',
  '/farmbook/landparcel',
  '/farmbook/notification',
  '/farmbook/user',
];

const loadOneSchema = async (schemaId: string): Promise<any> => {
  console.log('loading schema', schemaId);
  const api = JsonAdapter.getModel(schemaId);
  const list = await api.list({});
  const mongoApi: IDbModelApi = MongoAdapter.getModel(schemaId);
  const results = await mongoApi.createMany(list);
  console.log(results);
  return results;
};

const disconnect = () => MongoAdapter.disconnect();

const main = async () => {
  await MongoAdapter.connect();
  JsonAdapter.connect();
  return Promise.all(schemaNames.map(loadOneSchema))
    .then(disconnect)
    .then(() => 'Finished');
};

main();

/*

Execution steps:

1. compile to js:
node_modules/typescript/bin/tsc tools/fakedb2mongodb.ts --resolveJsonModule --esModuleInterop --allowJs -outDir build

2. set env:
export DATABASE_URL="mongodb+srv://carbonmint:6btPxbcIgRTtS3ds@cluster0.fjifail.mongodb.net/demo?retryWrites=true&w=majority"

3. run:
LOG_LEVEL=debug node build/tools/fakedb2mongodb.js

*/
