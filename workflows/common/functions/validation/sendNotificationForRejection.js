import { getModel } from '~/backendlib/db/adapter';
import dayjs from 'dayjs';
import { fetchUserNameAndRole } from '~/backendlib/util/getUserNameRole';

const sendNotificationForRejection = async (ctx) => {
  const { logger, wf } = ctx;
  logger.debug('sending notification for rejection');
  const { domainContextObjectId, domainContextSchemaId, domainSchemaId, domainObjectId } = wf;
  const schemaId = `/farmbook/notification`;
  const modelApi = getModel(schemaId);
  const domainSchema = domainSchemaId.split('/').pop();
  const domainContextSchema = domainContextSchemaId.split('/').pop();
  const userNameRole = await fetchUserNameAndRole(ctx?.session?.userId);
  const sender = { id: ctx?.session?.userId, ...userNameRole };
  await modelApi.create({
    message: `${
      domainSchema?.charAt(0).toUpperCase() + domainSchema?.slice(1)
    } Review/Validation Failed | Notes: ${ctx?.event?.data?.notes || 'NA'}`,
    status: `Unread`,
    link: `/${domainContextSchema}/${domainContextObjectId}/${domainSchema}/${domainObjectId}`,
    createdAt: dayjs().toISOString(),
    category: 'Validation',
    sender,
    receiver: '',
  });
};

export default sendNotificationForRejection;
