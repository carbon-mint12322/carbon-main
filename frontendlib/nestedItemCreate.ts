import axios from 'axios';

/** */

interface Params {
  baseUrl: string;
  parentId: string;
  childResourceUri: string;
  modelName?: string;
  payload: object;
  onSuccess?: (response?: any) => void;
  onError?: (err?: any) => void;
}

export async function nestedItemCreate({
  baseUrl,
  parentId,
  childResourceUri,
  modelName,
  payload,
  onSuccess,
  onError,
}: Params) {
  let successCallback = onSuccess ? onSuccess : () => { };
  let errorCallback = onError ? onError : () => { };

  axios
    .post(`${baseUrl}/nested/${modelName}/${parentId}/${childResourceUri}`, payload)
    .then(successCallback)
    .catch(errorCallback);
}
