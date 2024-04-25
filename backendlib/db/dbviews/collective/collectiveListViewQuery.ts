import MongoAdapter from '../../MongoAdapter';
import { model2collection, model2schemaId } from '../util';

const COLLECTIVE_SCHEMA_ID = model2schemaId('collective');
const CollectiveApi = MongoAdapter.getModel(COLLECTIVE_SCHEMA_ID);

export const collectiveListViewQuery = async (
  filter = {},
  collectiveId?: string,
  orgSlug?: string,
  user?: any,
  options?: any,
) => {
  const dbResult = await CollectiveApi.list(filter);
  const collectiveSlugs = Object.keys(user.roles);
  // Massage the output to the desired format
  return postProcess(dbResult.filter((item: any) => collectiveSlugs.includes(item.slug)));
};

const postProcess = (dbResult: any) => {
  try {
    const result = dbResult.map((item: any) => ({
      ...item,
      id: item._id,
    }));
    return JSON.parse(JSON.stringify(result));
  } catch (e) {
    console.log('ERROR in collectiveListViewQuery:postProcess', e);
  }
};
