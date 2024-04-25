import dayjs from 'dayjs';
import { historyStateLabel } from './historyStateLabel';
import { getModel } from '~/backendlib/db/adapter';
import { get } from 'lodash';

const UserModelApi = getModel('/farmbook/users');

/** */
export async function getFirstValidationLifeCycleEvent({
  createdAt,
  createdBy,
}: {
  createdAt: string;
  createdBy: string;
}) {
  let userName = '';

  //
  if (createdBy) {
    const user = await UserModelApi.get(createdBy);

    //
    if (user) {
      userName =
        get(user, 'personalDetails.firstName', '') +
        ' ' +
        get(user, 'personalDetails.lastName', '');
    }
  }

  return [
    {
      username: userName ?? '',
      status: historyStateLabel({ name: 'editable', data: {} }),
      dateTime: dayjs(createdAt).format('DD/MM/YYYY'),
      notes: '',
    },
  ];
}
