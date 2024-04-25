import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ScheduleNotificationsForPlanInputParams,
  scheduleNotificationsForPlan,
} from '~/backendlib/crop/plan/schedule';
import { getModel } from '~/backendlib/db/adapter';
import { withMongo } from '~/backendlib/middleware';
import { httpPutHandler } from '~/backendlib/middleware/put-handler';
import withDebug from '~/backendlib/middleware/with-debug';
import { getAdminRole, withPermittedRoles } from '~/backendlib/rbac';
import { PlanT } from '~/backendlib/types';

const PlanModelApi = getModel('/farmbook/plan');

/** */
async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  try {
    res.setHeader('Content-Type', 'application/json');

    const userId = (req as any)?.carbonMintUser?._id?.toString();

    //
    const plans: PlanT[] = await getAllV1NotificationPlans();

    if (!plans.length) return res.json('No plans to migrate');

    // Get params for scheduling notification
    const getParams = (plan: PlanT): ScheduleNotificationsForPlanInputParams => {
      return {
        plan: {
          _id: plan._id.toString(),
          events: plan.events,
        },
        orgSlug: req.query.org as string,
        userId,
      };
    };

    // Pass each plan events params to scheduleNotificationsForPlan
    // which returns planId or null
    const migratedPlanIds: string[] = (
      await Promise.all(plans.map((plan) => handleNotificationScheduling(getParams(plan))))
    ).filter((v: string | null) => typeof v === 'string' && v.length > 0) as string[];

    const nonMigrated: string[] = plans
      // get non migrated plans
      .filter((plan) => !migratedPlanIds.includes(plan._id.toString()))
      // get plan id as string
      .map((plan) => plan._id.toString());

    return res.json({ migratedPlanIds, nonMigrated });
  } catch (e) {
    console.log(e);
  }

  return res.status(500).json(false);
}

/** get all plans which are not yet converted to v2 */
async function getAllV1NotificationPlans(): Promise<PlanT[]> {
  return PlanModelApi.list({
    $or: [
      // field should not exists
      { isNotificationsMigratedToV2: { $exists: false } },
      // or it should be false
      { isNotificationsMigratedToV2: false },
    ],
  });
}

/** */
async function handleNotificationScheduling(
  params: ScheduleNotificationsForPlanInputParams,
): Promise<string | null> {
  try {
    // check if the plan is migrated
    if (!(await scheduleNotificationsForPlan(params)))
      throw new Error('Notifications were not updated for Plan: ' + params.plan._id);

    // migration is updated here so that it will mark each plan as soon as it's migrated
    await markMigrationForPlanIds({
      planIds: [params.plan._id],
      userId: params.userId,
    });

    //
    return params.plan._id.toString();
  } catch (e) {
    console.log('Error when migrating for');
    console.log(params);
    console.log(e);
  }

  return null;
}

/** mark plans ids as migrated to v2 notification */
async function markMigrationForPlanIds({
  planIds,
  userId,
}: {
  planIds: string[];
  userId: string;
}): Promise<boolean> {
  //
  const res = await PlanModelApi.updateMany(
    // get plans for all ids
    { _id: { $in: planIds.map((id) => new ObjectId(id)) } },
    // mark them as migrated for v2
    { isNotificationsMigratedToV2: true },
    userId,
  );

  //
  if (res.modifiedCount !== planIds.length) {
    throw new Error('Plan was not marked as migrated.');
  }

  return true;
}

// Enforces role check
const wrap = withPermittedRoles([getAdminRole]);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpPutHandler(withMongo(handler))));
