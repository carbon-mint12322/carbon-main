import { mobileNotificationListViewQuery } from '../db/dbviews/mobileNotification/mobileNotificationListViewQuery';


export const listMobileNotifications = (filter = {}, collectiveId?: string, orgSlug?: string) =>
  mobileNotificationListViewQuery(
    {
      category: { $in: ['Plan'] },
      orgSlug,
      ...filter,
    },
    { $limit: 100 },
  );
