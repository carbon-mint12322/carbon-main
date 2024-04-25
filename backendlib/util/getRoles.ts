import {
  getCreateRoles,
  getDeleteRoles,
  getListRoles,
  getUpdateRoles,
  withPermittedRoles,
} from '~/backendlib/rbac';

/** */
export function getRoles(
  schema: string,
  httpVerb?: 'GET' | 'POST' | 'PUT' | 'DELETE' | string,
): string[] {
  switch (httpVerb) {
    case 'GET':
      return getListRoles(schema);
    case 'PUT':
      return getCreateRoles(schema);
    case 'POST':
      return getUpdateRoles(schema);
    case 'DELETE':
      return getDeleteRoles(schema);

    default:
      throw new Error('verb not supported');
  }
}
