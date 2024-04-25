export default function prefixObjectKeys({ prefix, obj }: { prefix: string; obj: any }) {
  const res: any = {};

  Object.keys(obj).map((key, index) => {
    res[`${prefix}.${key}`] = obj[key];
  });

  return res;
}
