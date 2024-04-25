import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { scheduleNotificationForPlanEvent } from '~/backendlib/crop/plan/schedule';
import { deleteScheduledNotification } from '~/backendlib/crop/plan/schedule/deleteScheduledNotification';
import { getModel } from '~/backendlib/db/adapter';
import { httpPostHandler, withMongo } from '~/backendlib/middleware';
import withDebug from '~/backendlib/middleware/with-debug';
import { getAdminRole, withPermittedRoles } from '~/backendlib/rbac';
import { PlanEventT } from '~/backendlib/types';
import { getNumberOfDaysBeforePlanEventForNotification } from '~/backendlib/util/getNumberOfDaysBeforePlanEventForNotification';
import { rearrangeDateDMYToYMD } from '~/backendlib/utils';

const planSchema = '/farmbook/plan';
const PlanApi = getModel(planSchema);

const scheduleNewPlanEventNotification = async ({
  orgSlug,
  userId,
  planId,
  planEvent,
}: {
  orgSlug: string;
  userId: string;
  planId: string;
  planEvent: PlanEventT;
}) => {
  try {
    // before: If it already has a notificationJobId delete that job
    if (planEvent.notificationJobId) deleteScheduledNotification(planEvent.notificationJobId);

    const eventDate = dayjs(rearrangeDateDMYToYMD(planEvent.range.start));

    // if planEvent is in past, no need to add notification object to it
    if (eventDate.isBefore(dayjs(new Date()))) return true;

    // 1. create notification job for each of them.
    // 2. update the notificationJobId for each plan event
    await scheduleNotificationForPlanEvent({
      date: eventDate.add(getNumberOfDaysBeforePlanEventForNotification(), 'days').toISOString(),
      planId,
      eventPlanId: planEvent._id,
      userId,
      orgSlug,
    });

    return true;
  } catch (e) {
    console.log(e);
  }

  return false;
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  try {
    // getting user id
    const userId = (req as any)?.carbonMintUser?._id?.toString();

    // get org
    const orgSlug = req.query.org;
    if (!(orgSlug && typeof orgSlug === 'string')) throw new Error('Org slug not valid');

    // get crop id
    const { cropId: cropId }: { cropId: string } = req.query as any;
    if (!cropId) throw new Error('Plan Id not valid.');

    // get plans for crop
    const plan = await PlanApi.getByFilter({ cropId });
    if (!(plan?._id && plan.events)) throw new Error('Plan not valid.');

    // loop plan events and push the below function into promises
    const promises: Array<Promise<boolean>> = [];

    plan.events?.map((planEvent: PlanEventT) => {
      promises.push(
        scheduleNewPlanEventNotification({
          orgSlug,
          userId,
          planId: plan._id,
          planEvent,
        }),
      );
    });

    // run all promises
    const result = (await Promise.all(promises)).every((r) => r === true);

    // if all success, return affirmative
    if (result) return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
  }

  return res.status(500).json({ success: false });
};

// Enforces role check
const wrap = withPermittedRoles([getAdminRole]);

export default withDebug(wrap(httpPostHandler(withMongo(withMongo(handler)))));
