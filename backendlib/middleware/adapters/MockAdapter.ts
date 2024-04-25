import * as T from './types';

const MOCK_ID_TOKEN = 'some made up stuff';

const mockFindToken = (_request: T.ITokenSource): Promise<string> => Promise.resolve(MOCK_ID_TOKEN);

const mockVerifyToken = (token: string) =>
  new Promise<T.IAuthRecord>((resolve, reject) => {
    if (token !== MOCK_ID_TOKEN) {
      return reject('Invalid token');
    }
    return resolve({
      email: 'me@example.com',
      phone_number: '91919191919191',
      uid: '23123234234234',
    });
  });

const mockVerifyIdToken = (token: string) =>
  new Promise<T.IAuthRecord>((resolve, reject) => {
    if (token !== MOCK_ID_TOKEN) {
      return reject('Invalid token');
    }
    return resolve({
      email: 'me@example.com',
      phone_number: '91919191919191',
      uid: '23123234234234',
    });
  });

const mockFindDbUser = (authRecord: T.IAuthRecord | null) =>
  new Promise<T.IDbUser>((resolve, reject) => {
    reject(new Error('TBD'));
  });

const mockCheckAccess = (permittedRoles: T.Role[]) => (user: T.IDbUser, serviceName: string) =>
  new Promise<boolean>((resolve, reject) => {
    reject(new Error('TBD'));
  });

const authAdapter: T.IAuthAdapter = {
  findToken: mockFindToken,
  verifyToken: mockVerifyToken,
  findDbUser: mockFindDbUser,
  checkAccess: mockCheckAccess,
  verifyIdToken: mockVerifyIdToken,
};

export default authAdapter;
