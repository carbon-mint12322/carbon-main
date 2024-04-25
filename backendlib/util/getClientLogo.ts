import { get } from 'lodash';

export function getClientLogo(): { clientLogo: string } {
  return { clientLogo: get(process, 'env.TENANT_NAME', '') };
}
