const l_map = require('lodash/map');
const fromPairs = require('lodash/fromPairs');
const identity = require('lodash/identity');
const zip = require('lodash/zip');
const keys = require('lodash/keys');
const values = require('lodash/values');
const mapValues = require('lodash/mapValues');
const isObject = require('lodash/isObject');
const isArray = require('lodash/isArray');

type FilterFunction = Function;
type MapFunction = Function;

const asyncMapDeep =
  (matchFn: FilterFunction, mapFn: MapFunction) => (value: any, _key: string | undefined) => {
    const arrMapper = _aMapArr(matchFn, mapFn);
    const objMapper = _aMapObj(matchFn, mapFn);
    const valueMapper = mapFn;
    const identityMapper = identity;

    const innerMapper = isArray(value)
      ? arrMapper
      : isObject(value)
      ? objMapper
      : matchFn(value)
      ? valueMapper
      : identityMapper;
    return innerMapper(value);
  };

const _makeObject = (keys: string[], values: any[]) => fromPairs(zip(keys, values));

// _promiseAllProps awaits every value on obj, then returns a new object with the resolved values instead.
// All values of obj here are promises
const _promiseAllProps = async (obj: any) => {
  const pvalues = await Promise.all(values(obj));
  return _makeObject(keys(obj), pvalues);
};

const _aMapObj = (matchFn: FilterFunction, mapFn: MapFunction) => async (obj: any) => {
  const mapDeep = (val: any, key: string) => asyncMapDeep(matchFn, mapFn)(val, key);
  const objWithPromises = mapValues(obj, mapDeep);
  return await _promiseAllProps(objWithPromises);
};

const _aMapArr = (matchFn: FilterFunction, mapFn: MapFunction) => async (arr: any[]) => {
  const mapDeep = (val: any, key: string) => asyncMapDeep(matchFn, mapFn)(val, key);
  const proms = l_map(arr, mapDeep);
  return await Promise.all(proms);
};

export default asyncMapDeep;
