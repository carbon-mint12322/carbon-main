import { getModel } from '../db/adapter';
import { userDetailsViewQuery } from '../db/dbviews/user/userDetailsViewQuery';

const collectiveSchemaId = '/farmbook/collective';
const collectiveModelApi = getModel(collectiveSchemaId);

interface Role {
  operator: string;
  roles: string;
}

export const fetchCollectives = (filter = {}, options?: any) =>
  collectiveModelApi.list(filter, options);

const userRoleParser = async (data: any, collectives: any) => {
  const displayRoles: Role[] = [];
  for (const key in data.roles) {
    const operator = collectives?.find((e: any) => e.slug === key);
    if (operator) {
      displayRoles.push({ operator: operator.name, roles: data.roles[key].join(', ') });
    }
  }
  return {
    ...data,
    displayRoles,
  };
};

export const getUser = async (id: string) => {
  const result = await userDetailsViewQuery(id);

  const collectives = await fetchCollectives({
    slug: { $in: Object.keys(result.roles) },
  });

  return await userRoleParser(result, collectives);
};
