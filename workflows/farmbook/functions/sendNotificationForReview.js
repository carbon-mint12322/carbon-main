import { getModel } from '~/backendlib/db/adapter';
import dayjs from 'dayjs';

const sendNotification = (ctx) => {
  ctx.logger.debug('sending notification for approval');
  const schemaId = `/farmbook/notification`;
  const modelApi = getModel(schemaId);
  modelApi.create({
    message: `Farmer Submitted for Review | Notes: ${ctx?.event?.data?.notes}`,
    status: `Unread`,
    link: `/farmer/${ctx?.wf?.domainObjectId}`,
    createdAt: dayjs().toISOString(),
    category: 'Validation',
    sender: ctx?.session?.userId,
    receiver: '',
  });
};

export default sendNotification;
