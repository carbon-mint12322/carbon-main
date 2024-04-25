import { NextApiRequest, NextApiResponse } from 'next';
import { withPermittedRoles } from '~/backendlib/rbac';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withMongo from '~/backendlib/middleware/with-mongo';
import withDebug from '~/backendlib/middleware/with-debug';
import { ahdashboardDetailsView } from '~/backendlib/db/dbviews/ahdashboard/ahdashboardDetailsView';

const permittedRoles = ['AGENT', 'ADMIN'];

// Supporting function for getServerSideProps
export const getGssp = async (context: any) => {
  const data = await ahdashboardDetailsView(context.params);
  return { props: { data } };
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const result = await ahdashboardDetailsView(req.query);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
};

// Enforces role check
const wrap = withPermittedRoles(permittedRoles);

// Wrap in post-handler, which permits http posts only
export default withDebug(wrap(httpGetHandler(withMongo(handler))));
