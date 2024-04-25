import { generateLocalId } from '../db/util';
import { uploadFormFile } from '../upload/file';
import makeLogger from '../logger';
import { getModel } from '../db/adapter';
import { fetchUserNameAndRole } from '../util/getUserNameRole';
import dayjs from 'dayjs';

const logger = makeLogger('/api/.../task/create');

const schemaId = `/farmbook/task`;
const modelApi = getModel(schemaId);
const notificationSchemaId = '/farmbook/notification';
const notificationDbApi = getModel(notificationSchemaId);

const createNotification = async (taskId: string, taskDetails: any, userId: string, collectiveId: string) => {
  const userNameRole = await fetchUserNameAndRole(userId);
  const notifData = {
    message: 'Task created | ' + taskDetails.name || '',
    link: '/task/' + taskId,
    status: 'Unread',
    relatedTo: { objectId: taskId, collectionName: schemaId },
    createdAt: dayjs().toISOString(),
    category: 'Task',
    sender: { id: userId, ...userNameRole },
    receiver: taskDetails.assignee,
    collective: collectiveId,
  };
  await notificationDbApi.create(notifData, userId);
};

export const createTask = async (data: any, userId: string) => {
  const parsedData = await uploadFormFile(data.requestData);
  const taskInput = {
    ...JSON.parse(JSON.stringify(parsedData)),
    collective: data.collective.id,
    assignor: userId,
    fbId: generateLocalId(data.collective.name, 'TASK'),
  };
  logger.debug('Creating new task in DB');
  const createResult = await modelApi.create(taskInput, userId);
  logger.debug('Task object created');
  logger.debug('Creating new notification for task in DB');
  await createNotification(
    createResult.insertedId.toString(),
    data.requestData,
    userId,
    data.collective.id,
  );
  logger.debug('Task Notification object created');
  return createResult;
};
