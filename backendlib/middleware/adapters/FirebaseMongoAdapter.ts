import { intersection } from 'ramda';
import * as T from './types';
import firebaseVerify, { verifyIdToken as idToken } from '../verify-token';
import { getDbAdapter } from '../../db/adapter';
import makeLogger from '../../logger';

const logger = makeLogger('FirebaseAdapter');

const userSchemaId = '/farmbook/user';

const userDbApi = getDbAdapter().getModel(userSchemaId);

const findToken = (req: T.ITokenSource): Promise<string> => {
  const token = getCookieToken(req) || getBearerToken(req) || getQueryToken(req);

  return token ? Promise.resolve(token) : Promise.reject(new Error('NO_TOKEN'));
};

const verifyIdToken = async (token: string): Promise<T.IAuthRecord | null> =>
  idToken(token).then((decoded) => {
    if (!decoded) {
      return null;
    }
    const authRecord: T.IAuthRecord = {
      email: decoded.email,
      phone_number: decoded.phone_number,
      email_verified: decoded.email_verified,
      uid: decoded.uid,
    };
    return authRecord;
  });

const verifyToken = async (token: string): Promise<T.IAuthRecord | null> =>
  firebaseVerify(token).then((fbdecoded: any) => {
    if (!fbdecoded) {
      return null;
    }
    fbdecoded = fbdecoded.claims;
    const authRecord: T.IAuthRecord = {
      email: fbdecoded.email,
      phone_number: fbdecoded.phone_number,
      email_verified: fbdecoded.email_verified,
      uid: fbdecoded.uid,
    };
    return authRecord;
  });

const findDbUser = async (decodedToken: T.IAuthRecord | null) =>
  // eslint-disable-next-line
  new Promise<T.IDbUser | null>(async (resolve, _reject) => {
    //const uidFilter = { firebaseUid: decodedToken.uid }
    const phoneFilter = { 'personalDetails.primaryPhone': decodedToken?.phone_number };
    const emailFilter = { 'personalDetails.email': decodedToken?.email };
    const options = {
      projection: {
        _id: 1,
        id: 1,
        personalDetails: 1,
        roles: 1,
      },
      limit: 1,
    };
    await getDbAdapter().connect();
    const user =
      (decodedToken?.phone_number && (await userDbApi.getByFilter(phoneFilter, options))) ||
      (decodedToken?.email &&
        (await userDbApi.getByFilter(emailFilter, options))) ||
      null;

    resolve(user as any);
  });

const checkAccess =
  (permittedRoles: T.Role[]) => (user: T.IDbUser, serviceName: string, context: string) =>
    new Promise<boolean>((resolve, reject) => {
      logger.info('[RBAC][FirebaseMongoAdapter][checkAccess] ', user, serviceName);
      const userRoles = user.roles[context] || [];
      console.log('Comparing', permittedRoles, userRoles, context);
      const intersectionRoles = intersection(permittedRoles, userRoles);
      logger.info(
        `[RBAC][permittedRoles] ${permittedRoles}, userRoles: ${userRoles} intersectionRoles: ${intersectionRoles}`,
      );
      if (intersectionRoles.length === 0) {
        logger.info(`[RBAC]: Permission denied`);
        return reject(new Error('403'));
      }
      resolve(true);
    });

const authAdapter: T.IAuthAdapter = {
  findToken,
  verifyToken,
  findDbUser,
  checkAccess,
  verifyIdToken,
};

export default authAdapter;

/***
 * Token has this structure:
 * {
 *    iss: 'https://securetoken.google.com/carbon-mint-app',
 *    aud: 'carbon-mint-app',
 *    auth_time: 1654604006,
 *    user_id: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2',
 *    sub: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2',
 *    iat: 1654604069,
 *    exp: 1654607669,
 *    phone_number: '+919999999999',
 *    firebase: { identities: { phone: [Array] }, sign_in_provider: 'phone' },
 *    uid: 'kIt9gfL6eEg2AFYAnAYmwX5OIgf2'
 * )}
 *
 */

const getBearerToken = (req: any) => {
  const authHeader: string = req.headers.Authorization || req.headers.authorization || '';
  if (!(authHeader && authHeader.length > 0)) {
    logger.info('[DEBUG][AUTH] no authorization header');
    return null;
  }
  logger.info('[DEBUG][AUTH] auth header found');
  const [_, token] = authHeader.split(' ');
  if (token && token.length > 0)
    logger.info('[DEBUG][AUTH] userToken found in authorization header');
  else logger.info('[DEBUG][AUTH] no token');
  return token;
};

const getCookieToken = (req: any) => {
  const cookie = req.cookies && req.cookies.userToken;
  if (cookie) logger.info('[DEBUG][AUTH] userToken cookie found');
  else logger.info('[DEBUG][AUTH] no cookie');
  return cookie;
};
const getQueryToken = (req: any) => {
  const token = req.query && req.query.userToken;
  if (token) logger.info('[DEBUG][AUTH] userToken found in query string');
  else logger.info('[DEBUG][AUTH] no cookie');
  return token;
};
