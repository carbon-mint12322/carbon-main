/* eslint-disable no-console */
require('dotenv').config();

import CollectionAndFields from './input/collectionAndFields';
import { Collection, Document, ObjectId } from 'mongodb';

import { callbackRunOnEachCollection } from '../util/callbackRunOnEachCollection';
import { has } from 'lodash';

type CollectionKey = keyof typeof CollectionAndFields;

const collectionKeys = Object.keys(CollectionAndFields) as CollectionKey[];

/** Run for all collections asynchronously */
Promise.all(collectionKeys.map(handler))
  .then(console.log)
  .catch(console.log)
  .finally(() => {
    console.log('completed');
    process.exit(0);
  });

/** */
async function handler(collectionName: CollectionKey) {
  //
  const callback = (collection: Collection) =>
    runOnEachFieldAndUpdate({
      collection,
      fields: CollectionAndFields[collectionName],
    });

  //
  return callbackRunOnEachCollection({
    collectionName,
    callback,
  });
}

/** */
async function runOnEachFieldAndUpdate({
  collection,
  fields,
}: {
  collection: Collection;
  fields: string[];
}): Promise<boolean> {
  // get all documents on collection
  const documents = await collection.find().toArray();

  // prepare promises
  const promises = documents.map((document: Document) =>
    updateDocument({
      collection,
      fields,
      document,
    }),
  );

  // run promise and check if all results are true
  return (await Promise.all(promises)).every((r) => r);
}

/** */
async function updateDocument({
  collection,
  document,
  fields,
}: {
  collection: Collection;
  document: Document;
  fields: string[];
}): Promise<boolean> {
  // throw error if document id not valid
  if (!document?._id?.toString().length)
    throw new Error(
      `Document (${JSON.stringify(document)}) not validon collection: ${collection.collectionName}`,
    );

  // prepare new dcoument
  const newDocument: any = { ...document };

  //
    for (const field of fields) {
      // get formatted array value
      const newArrVal = addIdToFieldObjects({
        document,
        field,
      });

      // Only update the field val, if it's an array
      if (newArrVal && Array.isArray(newArrVal) && newArrVal.length) {
        newDocument[field] = newArrVal;
      }
    }

  // update the  document
  const updatedResult = await collection.findOneAndUpdate(
    { _id: newDocument._id },
    { $set: newDocument },
  );

  // check if it's modified, else console.error
  return updatedResult.ok === 1;
}

/** */
function addIdToFieldObjects({
  document,
  field,
}: {
  document: Document;
  field: string;
}): Object[] | null {
  // if document does not have field, return null
  if (!has(document, field)) return null;

  // get nested field object
  const arr = document[field];

  // if selected nested field is not array, return it
  if (!(arr && Array.isArray(arr) && arr.length)) return null;

  // loop each item and add id
  const newArr = arr.map((item: Object) => ({
    // generate new id
    _id: new ObjectId(),
    //
    //
    /***** IMPORTANT: IF IT ALREADY HAS ID, THEN DO NOT CHANGE IT LET IT OVERRIDE NEW VALUE*/
    ...item,
    //
    //
  }));

  return newArr;
}
