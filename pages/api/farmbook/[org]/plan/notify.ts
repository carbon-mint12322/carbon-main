import { Notify } from '@carbon-mint/notifications';
import { NextApiRequest, NextApiResponse } from 'next';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { httpPostHandler } from '~/backendlib/middleware/post-handler';
import { getModel } from '~/backendlib/db/adapter';
import { UnprocessableEntityError } from 'errors/UnprocessableEntity';
import { NotFoundError } from 'errors/NotFoundError';

import {
  CustomHttpError,
  DynamicObject,
  PlanEventT,
  PlanT,
  UserDeviceT,
  UserDeviceTokenT,
} from '~/backendlib/types';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';

import { getFcmCredentials } from '~/backendlib/util/getFcmCredentials';
import SentryException from '~/backendlib/sentry/SentryException';

const CollectiveModel = getModel('/farmbook/collective');
const PlanModel = getModel('/farmbook/plan');

const CropSchemaId = '/farmbook/crop';
const CropModel = getModel('/farmbook/crop');

const UserModel = getModel('/farmbook/users');
const NotificationModel = getModel('/farmbook/notification');
const FarmerModel = getModel('/farmbook/farmer');
const AgentModel = getModel('/farmbook/agents');

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  if (!isCronAuth(req.headers.scheduler_authorization as string)) {
    return res.status(401).json({ status: 'Unauthorized' });
  }

  try {
    const { jobId, eventPlan, entity, entityName, schemaId } = await getNotificationProps(req);

    const promises = [];

    // Send push notification to subscribed users
    promises.push(initiateNotification({ entity, eventPlan, jobId, entityName, schemaId }));

    const result = (await Promise.all(promises)).every((r) => r === true);

    if (!result) throw new Error("Some actions might've not completed.");
  } catch (e: unknown) {
    console.log({ error: e });
    SentryException(e);

    // Check if is http error,
    // if then return generic templated response with throwed message
    if ((e as CustomHttpError)?.isHttpError) {
      return res.status((e as any).statusCode).send({ message: (e as any).message });
    }

    return res.status(500).send({ message: 'Server error. Check log.' });
  }

  return res.status(200).send('done.');
}

/**
 *
 */
function isCronAuth(key: string) {
  const schedulerAccessToken = process.env.FARMBOOK_SCHEDULER_AUTH_TOKEN || false;
  return schedulerAccessToken && schedulerAccessToken === key;
}

/** */
async function getNotificationProps(req: NextApiRequest): Promise<{
  collective: any;
  plan: PlanT;
  eventPlan: PlanEventT;
  entity: any;
  jobId: string;
  entityName: string;
  schemaId: string;
}> {
  // Check job id
  const jobId = req.body.jobId;
  if (!jobId) throw UnprocessableEntityError('Job Id not valid.');

  // Check org validity
  const org = req?.query?.org;
  if (!org) throw UnprocessableEntityError('Org not valid.');
  const collective = await CollectiveModel.getByFilter({ slug: org });
  if (!collective?._id) throw NotFoundError('Collective not found.' + JSON.stringify({ org }));

  // Check plan & event plan validity
  const { planId, eventPlanId } = req.body;
  if (!planId) throw UnprocessableEntityError('PlanId not valid.' + JSON.stringify({ planId }));
  if (!eventPlanId)
    throw UnprocessableEntityError('eventPlanId not valid.' + JSON.stringify({ eventPlanId }));

  // Check if plan is available
  const plan = await PlanModel.get(planId);
  if (!plan?._id) throw NotFoundError('Plan not found.') + JSON.stringify({ planId });

  // TODO: MAKE CROP MODEL GENERIC BY UPDATING PLAN COLLECTION
  var schemaModel;
  var entity;
  if (plan.relatedTo) {
    schemaModel = getModel(plan?.relatedTo?.schemaId);
    entity = await schemaModel.getByFilter({
      _id: new ObjectId(plan?.relatedTo?.entityId),
      // CONSIDERING THAT ALL THE COLLECTION WILL HAVE THIS ACTIVE KEY
      active: true,
    });
  } else {
    // Check if crop is available and active
    schemaModel = CropModel;
    entity = await CropModel.getByFilter({
      _id: new ObjectId(plan.cropId),
      active: true,
    });
  }

  if (!entity?._id)
    throw NotFoundError(
      'Entity not found.' + JSON.stringify(plan?.relatedTo || { cropId: plan.cropId }),
    );

  // Check if event plan is available
  const eventPlan = plan.events.find((i: any) => i._id.toString() === eventPlanId.toString());
  if (!eventPlan?._id)
    throw NotFoundError('Event Plan not found. Info:' + JSON.stringify({ plan }));

  return {
    collective,
    plan,
    eventPlan,
    entity,
    jobId,
    entityName: plan?.relatedTo?.entityName || 'crop',
    schemaId: plan?.relatedTo?.schemaId,
  };
}

/** */
async function initiateNotification({
  entity,
  eventPlan,
  jobId,
  entityName,
  schemaId,
}: {
  entity: any;
  eventPlan: PlanEventT;
  jobId: string;
  entityName: string;
  schemaId: string;
}) {
  // get subscribed user ids
  const subscribedUserIds = await getSubscribedUserIds(entity);

  // get notification object which needs to be sent
  const { data, notification } = getNotificationObjects({ entity, eventPlan, entityName });

  // create crop notification
  await createCropNotifications({
    message: { ...data, title: notification.title || '' },
    id: data.id.toString(),
    collectionName: schemaId || CropSchemaId,
    subscribedUserIds,
    jobId,
  });

  // Send push notification
  return sendPushNotificationForDevices({
    data,
    notification,
    subscribedUserIds,
  });
}

/** */
// HERE CONSIDERING THAT ALL THE ENTITIES WILL HAVE COMMON FARMER REFERENCE
async function getSubscribedUserIds(entity: { farmer: { id: string } }): Promise<ObjectId[]> {
  // TODO : in future this will call the subscriber table and get all the userIds subcribed to crop notification

  // check if farmers is available and active
  const farmer = await FarmerModel.getByFilter({
    _id: new ObjectId(entity.farmer.id),
    active: true,
  });

  const farmerUserId = { _id: farmer?.userId?.toString() };

  const agentUserIds = await getAgentUserIds(farmer);

  //  get farmer userId and return in an enclosed array
  const allUserIds = [farmerUserId, ...agentUserIds];

  return allUserIds.map((user: { _id: string }) => {
    return new ObjectId(user._id);
  });
}

/** */
async function getAgentUserIds(farmer: { agents: string[] }): Promise<{ _id: string }[]> {
  // get agent ids for farmer
  const agentObjectIds = farmer.agents?.map((id: string) => new ObjectId(id)) || [];

  if (!agentObjectIds.length) return [];

  // get all agents of farmers
  const agents = await AgentModel.list(
    { _id: { $in: agentObjectIds } },
    { projection: { userId: 1 } },
  );

  if (!agents.length) return [];

  // Getting all user id of agents
  const stringifiedUserIds: { _id: string }[] = agents
    ?.filter((i: any) => i?.userId)
    .map((agent: { userId: ObjectId }) => {
      return { _id: agent.userId.toString() };
    });

  return stringifiedUserIds;
}

/**
 *
 * @param subscribedUsers
 * @returns
 */
async function getTokensForUsers(subscribedUserIds: ObjectId[]): Promise<UserDeviceTokenT[]> {
  // Get deviceTokens for users

  const users = await UserModel.list({ _id: { $in: subscribedUserIds } });

  const userDeviceTokens: UserDeviceTokenT[] = [];

  const pushDeviceToken = ({ userId, token }: UserDeviceTokenT) => {
    if (userId && token)
      userDeviceTokens.push({
        userId,
        token,
      });
  };

  const getDevicesForUser = (user: any) => {
    if (user?.devices?.length)
      user.devices.forEach((device: UserDeviceT) => {
        pushDeviceToken({ userId: user._id, token: device.fcmToken });
      });
  };

  users.forEach(getDevicesForUser);

  return userDeviceTokens;
}

/** */
function getNotificationObjects({
  entity,
  eventPlan,
  entityName,
}: {
  entity: any;
  eventPlan: PlanEventT;
  entityName: string;
}) {
  // getting text to send
  const text = getMessageFormattedForPushNotification({ entity, eventPlan, entityName });

  // returning prepared data
  return {
    data: {
      id: entity._id.toString(),
      type: entityName,
      message: text.toString(),
      eventType: `${entityName}PlanEvent`,
    },
    notification: {
      title: eventPlan.name || 'Crop notification',
      body: text.toString(),
    },
  };
}

/** */
function getMessageFormattedForPushNotification({
  entity,
  eventPlan,
  entityName,
}: {
  entity: any;
  eventPlan: PlanEventT;
  entityName: string;
}) {
  const getKeyname = (entityName: string) => {
    switch (entityName) {
      case 'crop':
        return 'Crop Name';
      case 'poultry':
        return 'Poultry Batch Name';
      case 'aqua':
        return 'Aqua Batch Name';
      case 'cow':
        return 'Cow Batch Name';
      case 'collective':
        return 'Collective Name';
      case 'goat':
        return 'Goat Batch Name';
      case 'sheep':
        return 'Sheep Batch Name';
      default:
        break;
    }
  };

  return (
    `🚨 Upcoming Event Alert 🚨` +
    '\n' +
    `${getKeyname(entityName)}: ${entity.name || entity.poultryType || entity.cropType}` +
    '\n' +
    `Farmer name: ${entity.farmer.name}` +
    '\n' +
    `Event name: ${eventPlan.name}` +
    `\n` +
    `Landparcel name: ${entity?.landParcel?.name}` +
    '\n' +
    `Start date: ${eventPlan.range.start}` +
    '\n' +
    `End date: ${eventPlan.range.end}`
  );
}

/** */
async function createCropNotifications({
  message,
  id,
  collectionName,
  subscribedUserIds,
  jobId,
}: Omit<CropNotificationParams, 'receiver'> & {
  subscribedUserIds: ObjectId[];
}): Promise<boolean> {
  // preparing promises array for async running
  const promises = subscribedUserIds.map((_id: ObjectId) =>
    createCropNotification({
      message,
      id,
      collectionName,
      receiver: _id,
      jobId,
    }),
  );

  // returning result of promises
  return (await Promise.all(promises)).every((r) => r);
}

/** */
async function createCropNotification({
  message,
  id,
  collectionName,
  receiver,
  jobId,
}: CropNotificationParams): Promise<boolean> {
  try {
    const notifData = {
      message,
      link: '',
      status: 'Unread',
      relatedTo: { objectId: id, collectionName },
      createdAt: dayjs().toISOString(),
      category: 'Plan',
      receiver,
      jobId,
    };

    await NotificationModel.create(notifData, 'cron');

    return true;
  } catch (e) {
    console.error(e);
    SentryException(e);
  }

  return false;
}

/** */
async function sendPushNotificationForDevices({
  data,
  subscribedUserIds,
  notification,
}: {
  data: DynamicObject;
  notification: { title: string; body: string };
  subscribedUserIds: ObjectId[];
}) {
  // get device tokens to send notifications to
  const userDeviceTokens: UserDeviceTokenT[] = await getTokensForUsers(subscribedUserIds);
  if (!userDeviceTokens.length) return false;

  const promises: Array<Promise<boolean>> = userDeviceTokens.map((userDeviceToken) => {
    return sendPushNotificationForSingleDevice({
      data,
      notification,
      ...userDeviceToken,
    });
  });

  return (await Promise.all(promises)).every((r) => r === true);
}

/** */
async function sendPushNotificationForSingleDevice({
  userId,
  token,
  data,
  notification,
}: {
  userId: string;
  token: string;
  data: DynamicObject;
  notification: { title: string; body: string };
}) {
  // TODO : integrate sentry to record all notifications outgoing

  try {
    const res = await Notify({
      type: 'fcm',
      message: {
        token,
        data,
        notification,
      },
      credentials: getFcmCredentials(),
    });

    return true;
  } catch (e) {
    // TODO : if device token is not valid (`request entity not found error`), remove the device token
    console.error('Error when sending push notifications');
    console.error(e);
    SentryException(e);
  }

  return true;
}

/** */
type CropNotificationParams = {
  message: any;
  id: string;
  collectionName: string;
  receiver: ObjectId;
  jobId: string;
};

// TODO: Protect this route by authenticating with a custom gen token
// Wrap in post-handler, which permits http posts only
export default withDebug(httpPostHandler(withMongo(handler)));
