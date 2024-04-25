import { MongoClient } from 'mongodb';

/** */
export async function getMongoCollection(mongoClient: MongoClient, collection: string) {
  try {
    return mongoClient.db(collection);
  } finally {
    await mongoClient.close();
  }
}
