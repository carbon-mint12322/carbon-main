import { NextApiRequest, NextApiResponse } from 'next';
import { getGetRoles, withPermittedRoles, withPermittedRolesGssp } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { getModel } from '~/backendlib/db/adapter';
import { parse } from 'json2csv';
import { flattenObject } from '~/backendlib/util/flattenObject';

const schemaId = '/farmbook/reports';
const modelApi = getModel(schemaId);
export const permittedRoles = ['ADMIN', 'AGENT'];

export const get = async (id: string) => modelApi.get(id);
export const getMulti = async (ids: string[]) => modelApi.getMulti(ids);
export const getList = async (reportType: string) => {
  const listSchemaId = `/farmbook/${reportType}`;
  const listModelApi = getModel(listSchemaId);
  return listModelApi.list({}, undefined);
};

const getReport = async (id: any) => {
  const obj = await get(id);
  const data = await getList(obj.reportType);
  const flattenedObject: any = data?.map((item: Record<string, any>) => flattenObject(item));
  const csvData = parse(flattenedObject);
  return { csvData, fileName: obj.reportName };
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const { id }: { id: string } = req.query as any;
  if (!id) {
    return res.status(400).json({ error: 'id required' });
  }
  const { csvData, fileName } = await getReport(id);
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Type', 'text/csv');
  res.status(200).send(csvData);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
