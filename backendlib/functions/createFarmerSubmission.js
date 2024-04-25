import { getModel } from '../db/adapter';
import { uploadFile } from '~/backendlib/file-upload';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import getAppName from '../locking/getAppName';

const eventSchemaId = '/farmbook/event';
const eventDbApi = getModel(eventSchemaId);
const planSchemaId = '/farmbook/plan';
const planDbApi = getModel(planSchemaId);
const notificationSchemaId = '/farmbook/notification';
const notificationDbApi = getModel(notificationSchemaId);
const userSchemaId = '/farmbook/user';
const userDbApi = getModel(userSchemaId);

const fetchPlanId = async (cropId) => {
  const plan = await planDbApi.getByFilter({ cropId });
  const planId = plan?._id.toString();
  return planId;
};

const fetchUserNameAndRole = async (userId) => {
  const user = await userDbApi.getByFilter({ _id: new ObjectId(userId) });
  return {
    name:
      user.personalDetails?.firstName +
      ' ' +
      (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
    role: user?.roles?.[getAppName()]?.[0] === 'FARMER' ? 'Farmer' : 'Field Officer',
  };
};

const createNotification = async (event) => {
  const notifData = {
    message: event.name + (event.notes ? ' - ' + event.notes : ''),
    link: '/submission/' + event._id.toString(),
    status: 'Unread',
    relatedTo: { objectId: event._id.toString(), collectionName: eventSchemaId },
    createdAt: dayjs().toISOString(),
    category: 'Submission',
    sender: event.createdBy,
    receiver: '',
  };
  await notificationDbApi.create(notifData);
};

export const createFarmerSubEvent = async (data, userId) => {
  if (!data.files) {
    throw new Error('No files submitted');
  }
  const planId = data?.fields?.cropId ? await fetchPlanId(data.fields.cropId) : 'NA';
  const userNameRole = await fetchUserNameAndRole(userId);
  let files = [];
  let photoRecords = [];
  let audioRecords = [];
  if (data.files.image) {
    const photoMeta = JSON.parse(data.fields.imageMeta) || [];
    const iFileArr = Array.isArray(data.files.image) ? data.files.image : [data.files.image];
    const imageFiles = iFileArr.map((file, i) => ({
      file,
      type: 'photo',
      metadata: photoMeta[i] || {},
    }));
    files = [...imageFiles];
  }

  if (data.files.audio) {
    const audioMeta = JSON.parse(data.fields.audioMeta) || [];
    const aFileArr = Array.isArray(data.files.audio) ? data.files.audio : [data.files.audio];
    const audioFiles = aFileArr.map((file, i) => ({
      file,
      type: 'audio',
      metadata: audioMeta[i] || {},
    }));
    files = [...files, ...audioFiles];
  }

  if (files.length > 0) {
    const evidences = await Promise.all(
      [...files].map(async (item) => {
        const uploadLink = await uploadFile(item.file, item.type, item.metadata);
        return {
          link: uploadLink,
          type: item.type,
        };
      }),
    );

    photoRecords = evidences.filter((ev) => ev.type === 'photo');
    audioRecords = evidences.filter((ev) => ev.type === 'audio');
  }

  const sameEvent = await eventDbApi.getByFilter({ mobileId: data.fields.id });
  const eventInput = {
    mobileId: data.fields.id,
    planId: planId ? planId : '',
    category: 'Submission',
    createdAt: data?.fields.ts,
    createdBy: { id: userId, ...userNameRole },
    photoRecords,
    audioRecords,
    notes: data.fields.notes,
    location: {
      lat: parseFloat(data.fields.lat),
      lng: parseFloat(data.fields.lng),
    },
  };
  if (data?.fields?.cropId) {
    eventInput['cropId'] = data?.fields?.cropId;
    eventInput['name'] = 'Crop Intervention';
  }
  if (data?.fields?.landParcelId) {
    eventInput['landParcelId'] = data?.fields?.landParcelId;
    eventInput['name'] = 'Land Parcel Intervention';
  }
  if (data.fields.productionSystemId) {
    eventInput['productionSystemId'] = data?.fields?.productionSystemId;
    eventInput['name'] = 'Production System Intervention';
  }

  if (data.fields.processingSystemId) {
    eventInput['processingSystemId'] = data?.fields?.processingSystemId;
    eventInput['name'] = 'Processing System Intervention';
  }

  let result;

  if (sameEvent) {
    result = false;
    return result;
  } else {
    result = await eventDbApi.create(eventInput, userId);
  }

  await createNotification({
    ...eventInput,
    _id: result.insertedId,
  });
  return result;
};
