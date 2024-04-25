import once from 'lodash/once';
import axios from 'axios';
import { onIdTokenChanged } from 'firebase/auth';
import { getAuth } from '~/utils/initAuth';

//   let token;
//   const getToken = () => token;
//   const setToken = (x) => (token = x);

//   onIdTokenChanged(getAuth(), async (user) =>
//     setToken(await user.getIdToken()));

// /**
//  * A simple HTTP interface that uses tokens from
//  * firebase before sending to server.
//  *
//  * Uses onIdTokenChanged subscription.
//  *
//  */
// export const httpInterface = once(() => {

//   const addAuthHeader = (options={}) => {
//     const headers = {
//       ...(options.headers||{}),
//       Authorization: `bearer ${getToken()}`
//     };
//     return {
//       ...options,
//       headers,
//     }
//   }

//   const httpGetWithToken = async (url, options={}) => {
//     if (! getToken()) {
//       throw new Error("User session token not available");
//     }
//     return axios.get(url, addAuthHeader(options));
//   };

//   const httpPostWithToken = async (url, data, options={}) => {
//     if (! getToken()) {
//       throw new Error("User session token not available");
//     }
//     return axios.post(url, data, addAuthHeader(options));
//   }

//   return { httpGetWithToken, httpPostWithToken };
// });

const authHeader = (token: string) => ({
  headers: {
    Authorization: `bearer ${token}`,
  },
});

export const postWithToken = (token: string) => (url: string, data: any) => {
  console.log('postWithToken(): Post requested with token', token);
  if (!token) {
    throw new Error('No auth token!');
  }
  return axios.post(url, data, authHeader(token));
};

export const getWithToken = (token: string) => (url: string) => {
  if (!token) {
    throw new Error('getWithToken(): No auth token!');
  }
  return axios.get(url, authHeader(token));
};
