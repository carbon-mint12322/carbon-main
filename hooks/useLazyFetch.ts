import { useReducer, useEffect, useState, useRef } from 'react';
import axios, { AxiosPromise } from 'axios';

type IAction<T> =
  | { type: 'PENDING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: any };

export type Status = 'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR';

export interface IState<T> {
  status: Status;
  error: any | null;
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
}

export interface UseFetchResponse<T> extends IState<T> {
  fetch: () => void;
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

const useLazyFetch = <T = any>(initUrl: string, initData?: T): UseFetchResponse<T> => {
  const cache = useRef<{ [key: string]: T }>({});
  const [url, setUrl] = useState(initUrl);
  const dataFetchReducer = createDataFetchReducer<T>();

  const initialState: IState<T> = {
    status: 'IDLE',
    error: null,
    data: initData,
    isLoading: false,
    isError: false,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  const fetchData = async () => {
    dispatch({ type: 'PENDING' });
    if (cache?.current[url]) {
      const data = cache?.current[url];
      dispatch({ type: 'SUCCESS', payload: data });
    } else {
      try {
        const axiosPromise: AxiosPromise<T> = axios(url);
        const res = await axiosPromise;
        cache.current[url] = res.data;
        dispatch({ type: 'SUCCESS', payload: res.data });
      } catch (error: any) {
        dispatch({ type: 'ERROR', payload: error.message });
      }
    }
  };

  const fetch = () => {
    fetchData();
  };

  return { ...state, fetch };
};

export default useLazyFetch;
