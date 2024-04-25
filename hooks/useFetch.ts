import { useReducer, useEffect, useState, useRef } from 'react';
import axios, { AxiosPromise } from 'axios';

type IAction<T> =
  | { type: 'PENDING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: any };

export type Status = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';

const noop = () => {};
interface UseFetchOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface IState<T> extends UseFetchOptions {
  status: Status;
  error: any | null;
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
}

export interface UseFetchResponse<T> extends IState<T> {
  reFetch: (url: string) => void;
}

const createDataFetchReducer =
  <T>() =>
  (state: IState<T>, action: IAction<T>): IState<T> => {
    switch (action.type) {
      case 'PENDING':
        return {
          ...state,
          isLoading: true,
        };
      case 'SUCCESS': {
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      }
      case 'ERROR':
        return {
          ...state,
          isLoading: false,
          isError: true,
          error: action.payload,
        };
      default:
        return state;
    }
  };

const useFetch = <T = any>(initUrl?: string, initData?: T, noCache?: boolean): UseFetchResponse<T> => {
  const cache = useRef<{ [key: string]: T }>({});
  const [url, setUrl] = useState(initUrl);
  const dataFetchReducer = createDataFetchReducer<T>();

  const initialState: IState<T> = {
    status: 'IDLE',
    error: null,
    data: initData,
    isLoading: true,
    isError: false,
    onSuccess: noop,
    onError: noop,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  const fetchDataIncludingCache = (url: string, noCache: boolean, cancelRequest?: boolean) => {
    dispatch({ type: 'PENDING' });
    if (cache?.current[url] && !noCache) {
      const data = cache?.current[url];
      dispatch({ type: 'SUCCESS', payload: data });
    } else {
      fetchData(url, cancelRequest);
    }
  };

  const fetchData = async (url: string, cancelRequest?: boolean) => {
    try {
      const axiosPromise: AxiosPromise<T> = axios(url);
      const res = await axiosPromise;
      cache.current[url] = res.data;
      if (cancelRequest) return;
      dispatch({ type: 'SUCCESS', payload: res.data });
    } catch (error: any) {
      if (cancelRequest) return;
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    let cancelRequest = false;
    if (!url) return;
    fetchDataIncludingCache(url, noCache || false, cancelRequest);
    return function cleanup() {
      cancelRequest = true;
    };
  }, [url]);

  const reFetch = (url: string) => {
    fetchData(url);
  };

  return { ...state, reFetch };
};

export default useFetch;
