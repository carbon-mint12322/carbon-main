import { getCreateRoles, withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { NextApiRequest, NextApiResponse } from 'next';
import { getModel } from '~/backendlib/db/adapter';

const schemaId = `/farmbook/reports`;
const permittedRoles = getCreateRoles(schemaId);
const modelApi = getModel(schemaId);

const extractQueryParams = (req: any) => req.query;

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const requestParams = extractQueryParams(req);
  res.setHeader('Content-Type', 'application/json');

  try {
    const parsedData = JSON.parse(JSON.stringify(requestParams));

    const result = await modelApi.aggregate([
      {
        $match: {
          reportName: parsedData.reportName,
        },
      },
    ]);

    if (result.length > 0) {
      // File found
      res.status(200).json({ message: 'File exists in the system', present: true });
    } else {
      // File not found
      res.status(200).json({ message: 'File not found in the system', present: false });
    }
  } catch (error: any) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in get-handler, which permits http get only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
