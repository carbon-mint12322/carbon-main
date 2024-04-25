import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { IronSessionOptions } from 'iron-session';

import { Handler } from '../types';
import { IAuthAdapter, IDbUser } from './adapters/types';
import firebaseMongoAuthAdapter from './adapters/FirebaseMongoAdapter';
import validateSession from 'auth/validate-session-be';

// Log a message and return the value provided.
// seee usage below
const taplog = (message: string) => (value: any) => {
  console.log(message);
  return value;
};

export const findSessionUserFromRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const authAdapter = getAuthAdapter();
  const session = await validateSession(req, res);
  const { user } = session;
  return await authAdapter.findDbUser(user);
};

export const getSession = (req: NextApiRequest): any => (req as any).session;
export const getSessionRoles = (session: any) => session?.user?.roles || [];

const addUserToSession = (req: NextApiRequest) => (user: IDbUser) => {
  const req_any = req as any;
  if (req_any.session) {
    req_any.session.user = user;
  } else {
    req_any.session = { user };
  }
  req_any.carbonMintUser = user;
  return user;
};

const rejectWhenNoUser = (res: NextApiResponse) => (user: IDbUser | null) => {
  if (user) {
    return user;
  }
  const msg = '[AUTH] No such user';
  denyAccess(res, msg);
  return Promise.reject(msg);
};

const _withAuthApi = (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const invokeHandler = async (_user: IDbUser) => handler(req, res);
  return findSessionUserFromRequest(req, res)
    .then(rejectWhenNoUser(res))
    .then(addUserToSession(req))
    .then(invokeHandler);
};

const options: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'userToken',
  // secure: true should be used in production (HTTPS) but can't be
  // used in development (HTTP)
  cookieOptions: {
    // for now
    secure: false, // process.env.NODE_ENV === 'production',
  },
};
export const withAuthApi = (handler: Handler) =>
  withIronSessionApiRoute(_withAuthApi(handler), options);

const denyAccess = (res: NextApiResponse, err: any) =>
  res.status(401).send({ error: err.toString(), message: 'Unauthorized' });

let authAdapter: IAuthAdapter = firebaseMongoAuthAdapter;

// Change adapter for testing purposes
export const useAdapter = (adapter: IAuthAdapter) => (authAdapter = adapter);

export const getAuthAdapter = (): IAuthAdapter => authAdapter;
