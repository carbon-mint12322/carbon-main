// NOTE: dayjs was throwing error for DD-MM-YYYY even when proper format was given, so converting here
import { ObjectId } from 'mongodb';
import { getModel } from '~/backendlib/db/adapter';

const userSchemaId = '/farmbook/user';
const userDbApi = getModel(userSchemaId);

export async function fetchUserNameAndRole(
  userId: string,
): Promise<{ name: string; role: string }> {
  const user = await userDbApi.getByFilter({ _id: new ObjectId(userId) });
  return {
    name:
      user.personalDetails?.firstName +
      ' ' +
      (user.personalDetails?.lastName ? user.personalDetails?.lastName : ''),
    role: user.roles['farmbook'] === 'ADMIN' ? 'Admin' : 'Agent',
  };
}
