import { getAuth } from '../../utils/initAuth';
import axios from 'axios';
import { prop } from 'ramda';
import Cookies from 'js-cookie';
import { isTokenExpired } from '~/contexts/AuthDialogContext';
import { getIdToken } from 'firebase/auth';

// Build header with auth token
const getHeaders = async () => {
  return {
    headers: {},
  };
};

export const validateTokenPromise = async () => {
  return new Promise((resolve, reject) => {
    let token = Cookies.get('userToken');
    let uidToken = Cookies.get('uid');

    if (token && uidToken && isTokenExpired(token)) {
      // PERFORM REFRESH FIRST
      let user = getAuth();
      return user.currentUser.getIdToken(true).then(resolve).catch(reject);
    } else {
      resolve();
    }
  });
};

export const validateToken = async (callback) => {
  let token = Cookies.get('userToken');
  let uidToken = Cookies.get('uid');

  if (token && uidToken) {
    if (isTokenExpired(token)) {
      // PERFORM REFRESH FIRST
      let user = getAuth();
      return user.currentUser
        .getIdToken(true)
        .then(callback)
        .catch((error) => callback({ error }));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const getData = prop('data'); // extract data field

export const httpGet = async (url, data = {}) =>
  axios.get(url, { params: data }, await getHeaders()).then(getData);

export const httpPost = async (url, data) =>
  axios.post(url, data, await getHeaders()).then(getData).catch(async (error) => {
    // Check if the error is a 504 Gateway Timeout
    if (error.response && error.response.status === 504) {
      console.log('Caught a 504 Gateway Timeout error. Retrying the API call...');
      return axios.post(url, data, await getHeaders()).then(getData); // Retry the API call recursively
    }
  });;

export const httpDelete = async (url) => axios.delete(url, await getHeaders()).then(getData);
