import { getModel } from '~/backendlib/db/adapter';
import dayjs from 'dayjs';
import { fetchUserNameAndRole } from '~/backendlib/util/getUserNameRole';

const sendNotificationForEntityReview = async (ctx) => {
  const { logger, wf } = ctx;
  logger.debug('sending notification for approval');
  const { domainSchemaId, domainObjectId } = wf;
  const schemaId = `/farmbook/notification`;
  const modelApi = getModel(schemaId);
  const domainSchema = domainSchemaId.split('/').pop();
  const userNameRole = await fetchUserNameAndRole(ctx?.session?.userId);
  const sender = { id: ctx?.session?.userId, ...userNameRole };
  await modelApi.create({
    message: `${
      domainSchema?.charAt(0).toUpperCase() + domainSchema?.slice(1)
    } Submitted for Review | Notes: ${ctx?.event?.data?.notes || 'NA'}`,
    status: `Unread`,
    link: `/${domainSchema}/${domainObjectId}`,
    createdAt: dayjs().format('DD/MM/YYYY hh:mm:ss'),
    category: 'Validation',
    sender,
    receiver: '',
  });
};

export default sendNotificationForEntityReview;
