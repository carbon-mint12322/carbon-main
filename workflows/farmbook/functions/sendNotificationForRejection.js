import { getModel } from '~/backendlib/db/adapter';
import dayjs from 'dayjs';

const sendAdminNotification = (ctx) => {
  ctx.logger.debug('sending notification for rejection');
  const schemaId = `/farmbook/notification`;
  const modelApi = getModel(schemaId);
  modelApi.create({
    message: `Farmer Review Failed | Notes: ${ctx?.event?.data?.notes}`,
    status: `Unread`,
    link: `/farmer/${ctx?.wf?.domainObjectId}`,
    createdAt: dayjs().toISOString(),
    category: 'Validation',
    sender: ctx?.session?.userId,
    receiver: '',
  });
};

export default sendAdminNotification;
