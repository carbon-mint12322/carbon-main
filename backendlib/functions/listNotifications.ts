import { notificationListViewQuery } from '../db/dbviews/notification/notificationListViewQuery';

export const listNotifications = (filter = {}, collectiveId?: string, orgSlug?: string) =>
  notificationListViewQuery(
    {
      category: { $in: ['Submission', 'Validation', 'Task'] },
      orgSlug,
      ...filter,
    },
    { $limit: 200 },
  );