import { Collection } from 'mongodb';
import { getMongoClient } from './getMongoClient';

type Params = {
  collectionName: string;
  callback: (collection: Collection) => Promise<boolean>;
};

/** Get collection from database */
export async function callbackRunOnEachCollection({
  collectionName,
  callback,
}: Params): Promise<Promise<boolean>> {
  const mongoClient = await getMongoClient(process.env.DATABASE_URL ?? '');
  // run on db change while running
  return callback(mongoClient.db('farmbookstg').collection(collectionName));
}
