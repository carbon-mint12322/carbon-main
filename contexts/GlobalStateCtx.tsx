import { createContext, useEffect, useState, useContext } from 'react';

interface IGlobalStateCtx {
  gsGet: (key: string) => any;
  gsSet: (key: string, value: any) => any;
  dict: any;
}

const makeCtxVal = (dict: any = {}): IGlobalStateCtx => {
  const gsGet = (key: string) => dict[key];
  const gsSet = (key: string, val: any) => (dict[key] = val);
  return { dict, gsSet, gsGet };
};

const GlobalStateCtx = createContext<IGlobalStateCtx>(makeCtxVal());

const Provider = (props: any) => {
  const { children, value } = props;
  const value2 = makeCtxVal(value);
  return <GlobalStateCtx.Provider value={value2}>{children}</GlobalStateCtx.Provider>;
};

// export const useGlobalStateCtx = () => useContext(GlobalStateCtx);

export const useGlobalStateCtx = (key: string, defaultValue: any) => {
  const { gsGet, gsSet } = useContext(GlobalStateCtx);
  const val = gsGet(key) || defaultValue;
  const set = (value: any) => gsSet(key, value);
  return [val, set];
};

export default Provider;
