type AnyRecord = Record<string, any>;

export function conversionFromEventDetailsToModalDetails(params: AnyRecord): Array<AnyRecord> {
  // Get root details
  const root = Object.keys(params)
    .filter((key) => typeof params[key] === 'string' || typeof params[key] === 'number')
    .map((key) => ({ [key]: params[key] }))
    .reduce((acc: Object, curr: Object) => ({ ...acc, ...curr }), {});

  //
  const otherDetails = Object.keys(params)
    .filter((key) => typeof params[key] === 'object')
    .map((key) => ({
      name: key,
      ...(Array.isArray(params[key]) ? { UIRenderValues: params[key] } : params[key]),
    }))
    .reduce(formatDetails, []);

  return [{ ...root, UIRenderType: 'root' }, ...otherDetails];
}

/** */
function formatDetails(acc: AnyRecord[], curr: AnyRecord): AnyRecord[] {
  // if value is array and first value is object, then split them and concat them with acc
  if (
    Array.isArray(curr.UIRenderValues) &&
    curr.UIRenderValues.length &&
    typeof curr.UIRenderValues[0] === 'object'
  ) {
    const updatedUIValues = curr.UIRenderValues.map((item: AnyRecord) => ({
      name: curr.name,
      ...item,
    }));
    return acc.concat(updatedUIValues);
  }

  acc.push(curr);
  return acc;
}
