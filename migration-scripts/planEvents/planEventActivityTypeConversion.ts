/* eslint-disable no-console */
require('dotenv').config();

import Collections from './input/collections';
import Conversion from './input/conversion';
const ConversionKeys = Object.keys(Conversion);

import { Collection, ObjectId } from 'mongodb';
import { PlanEventT, PlanT } from '~/backendlib/types';
import { callbackRunOnEachCollection } from '../util/callbackRunOnEachCollection';

/** Run for all collections asynchronously */
Promise.all(
  Collections.map((collectionName: string) =>
    callbackRunOnEachCollection({
      collectionName,
      callback: updateAllPlanEvents,
    }),
  ),
)
  .then(console.log)
  .catch(console.log)
  .finally(() => {
    console.log('completed');
    process.exit(0);
  });

/** */
async function updateAllPlanEvents(collection: Collection): Promise<boolean> {
  // construct a promise array of boolean
  const promises: Array<Promise<boolean>> =
    // 1. get all items in the collection
    (await getAllPlansForCollection(collection))
      // 2. get plan events and format them
      .map(getFormattedEvents)
      // 3. update plan with new events
      .map((plan: PlanT) =>
        updatePlanWithNewEvents({
          _id: new ObjectId(plan._id.toString()),
          events: plan.events,
          collection,
        }),
      );

  // run all promises, and check & return if all the results are true
  return (await Promise.all(promises)).every((r) => r);
}

/**  Get all plan documents for each collection */
async function getAllPlansForCollection(collection: Collection): Promise<PlanT[]> {
  return collection.find().toArray() as unknown as PlanT[];
}

/** get formatted plan events to update */
function getFormattedEvents(plan: PlanT): PlanT {
  const { events } = plan;

  // if events are not array, return original plan
  if (!Array.isArray(events)) return plan;

  const formattedEvents: PlanEventT[] = events.map((event: PlanEventT) => {
    // get activity
    let { activityType } = event;

    activityType = activityType.trim();

    // if key found in conversion return updated activity type
    if (ConversionKeys.includes(activityType)) {
      return {
        ...event,
        activityType: (Conversion as any)[activityType],
      };
    }

    // if key not valid or not found in Conversion then return original
    return event;
  });

  return { ...plan, events: formattedEvents };
}

/** update plan with new events list  */
async function updatePlanWithNewEvents({
  _id,
  events,
  collection,
}: {
  _id: ObjectId | undefined;
  events: PlanEventT[];
  collection: Collection;
}): Promise<boolean> {
  const { ok } = await collection.findOneAndUpdate({ _id }, { $set: { events } });
  return ok === 1;
}
