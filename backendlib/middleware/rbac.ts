import { NextApiRequest, NextApiResponse } from 'next';

import { Handler, GsspHandler } from '../types';
import { getAuthAdapter, findSessionUserFromRequest } from './with-auth-api';
import { IDbUser } from './adapters/types';

// Common role checking function that helps in wrapping
// Front-end (GSSP) and backend (pages/api) handlers.
const checkRole = async (permittedRoles: string[], req: any, res: any) => {
  const regex = /\/(farmbook| evlocker)\/(.*)\//i;
  const matches: string[] | undefined = req?.url?.match(regex);
  const org = req?.query?.org || matches?.[2]?.split('/')?.[0] || process.env.APP_NAME || '';
  return findSessionUserFromRequest(req, res)
    .then(taplog('[RBAC] Checking user role'))
    .then((user) =>
      getAuthAdapter()
        .checkAccess(permittedRoles)(user, 'HTTP', org)
        .then(taplog('[RBAC] access granted'))
        .then((_isAllowed) => user),
    )
    .then(taplog('[RBAC] User is in!'));
};

const addUserToSession = (req: NextApiRequest) => (user: IDbUser) => {
  (req as any).carbonMintUser = user;
  return user;
};

export const withPermittedRoles =
  (permittedRoles: string[]) =>
    // handler is the function being wrapped
    (handler: Handler): Handler =>
      // Wrapping logic
      async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
        const invokeHandler = async (_user: IDbUser) => handler(req, res);
        res.setHeader('Content-Type', 'application/json');

        return checkRole(permittedRoles, req, res)
          .then(addUserToSession(req))
          .then(invokeHandler)
          .catch((err: any) => {
            console.log(err, ' <== error');
            console.log('[RBAC] Denying access');
            res.status(401).send({ msg: 'Unauthorized' });
          });
      };

// Get serverside props version
export const withPermittedRolesGssp =
  (permittedRoles: string[]) =>
    // handler is the function being wrapped
    (handler: GsspHandler): GsspHandler =>
      // Wrapping logic
      async (context: any) => {
        const req = context.req;
        const invokeHandler = async (_user: IDbUser) => handler(context);

        return checkRole(permittedRoles, req, context.res)
          .then(addUserToSession(req))
          .then(invokeHandler)
          .catch((err: any) => {
            if (
              ['NO_TOKEN', '401', '403'].includes(err.message) ||
              err.code === 'auth/id-token-expired'
            ) {
              console.log('[RBAC] Denying access');
              console.log('[RBAC] Redirecting to login page');
              console.log('req.path is', context.resolvedUrl);
              return {
                redirect: {
                  permanent: false,
                  destination: `/public/login?redirect=${context.resolvedUrl}`,
                },
              };
            }
            return { code: 'ACCESS_DENIED', err: '' + err };
          });
      };

// Permitted roles for various operations
export const getCreateRoles = (modelName: string) => ['AGENT', 'EDITOR'];
export const getGetRoles = (modelName: string) => ['AGENT', 'VIEWER'];
export const getListRoles = (modelName: string) => ['AGENT', 'VIEWER'];
export const getUpdateRoles = (modelName: string) => ['AGENT', 'EDITOR'];
export const getDeleteRoles = (modelName: string) => ['AGENT', 'EDITOR'];

export const getEventCreateRoles = (modelName: string) => ['AGENT', 'FARMER', 'PROCESSOR'];

export const getAdminRole: string = 'ADMIN';

export const AllRoles = ['AGENT', 'EDITOR', 'VIEWER', 'FARMER', 'PROCESSOR'];

// Utility function
// Log a message and return the value provided.
// seee usage below
const taplog = (message: string) => (value: any) => {
  console.log(message);
  return value;
};
