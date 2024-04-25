const cursor2Objects = async (cursor: any) => {
  const objList: any[] = [];
  await cursor.forEach((o: any) => {
    const id = o._id.toString();
    const o2 = { ...o, id, _id: id };
    objList.push(o2);
  });
  console.log(`${objList.length} objects`);
  return objList;
};

export const getFromMongo =
  (collection: any, options: any) =>
  async (storageApi: any) =>
  async (filter = {}) => {
    const { mongoSearch } = storageApi;
    const mongoResults = await mongoSearch(collection)(filter, options);
    console.log('Mongo query', collection, filter, options);
    return cursor2Objects(mongoResults);
  };

export const makeProjection = (colDefs: any) =>
  colDefs
    .map((def: any) => def.field)
    .reduce((acc: any, name: string) => ({ [name]: 1, ...acc }), {});
