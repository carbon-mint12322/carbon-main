import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const setIdTokenCookie = (token) => {
  destroyCookie(null, 'userToken');
  setCookie(null, 'userToken', token, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

export const setRefreshCookie = (token) => {
  destroyCookie(null, 'userToken');
  setCookie(null, 'refreshToken', token, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

export const setUidCookie = (uid) =>
  setCookie(null, 'uid', uid, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

export const clearCookies = () => {
  localStorage.removeItem('operator');
  ['userToken', 'refreshToken', 'uid'].forEach((cookieName) => {
    console.log('destroying cookie', cookieName);
    destroyCookie(null, cookieName, {
      path: '/',
    });
  });
};
