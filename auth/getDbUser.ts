import { getDbAdapter } from '~/backendlib/db/adapter';

const userSchemaId = '/farmbook/user';
const userDbApi = getDbAdapter().getModel(userSchemaId);

async function getDbUser(email?: string, phone?: string) {
  const phoneFilter = {
    'personalDetails.primaryPhone': phone,
  };
  const emailFilter = { 'personalDetails.email': email };
  const options = {
    projection: {
      _id: 1,
      id: 1,
      personalDetails: 1,
      roles: 1,
      pin: 1,
    },
    limit: 1,
  };
  await getDbAdapter().connect();
  const user =
    (email && (await userDbApi.getByFilter(emailFilter, options))) ||
    (phone && (await userDbApi.getByFilter(phoneFilter, options))) ||
    null;

  return user;
}

export default getDbUser;
