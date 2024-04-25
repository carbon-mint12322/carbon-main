/* eslint-disable no-console */
require('dotenv').config();

import { Collection, ObjectId } from 'mongodb';

import { callbackRunOnEachCollection } from 'migration-scripts/util/callbackRunOnEachCollection';
import { toggleCropActivation } from '~/backendlib/crop/toggleCropActivation';

/** */

callbackRunOnEachCollection({
  collectionName: getCropsCollectionName(),
  callback: deleteNotificationJobsForDeactivatedCrops,
})
  .then(console.log)
  .catch(console.log)
  .finally(() => {
    console.log('completed');
    process.exit(0);
  });

/** */
export function getCropsCollectionName(): string {
  const TENANT = process.env.TENANT_NAME || 'TENANT';
  const APP = process.env.APP_NAME || 'APP';

  return `/${TENANT}/${APP}/crops`;
}

/** */
async function deleteNotificationJobsForDeactivatedCrops(collection: Collection): Promise<boolean> {
  //
  const deactivatedCropIds: string[] = await getDeactivatedCropsForCollection(collection);

  //
  return toggleCropActivation({
    activationStatus: false,
    cropIds: deactivatedCropIds,
    userId: '',
    orgSlug: '',
  });
}

/** get all deactivated crops */
async function getDeactivatedCropsForCollection(collection: Collection): Promise<string[]> {
  return (await collection.find({ active: false }).toArray())
    .map((crop) => [crop._id.toString()])
    .flat();
}
