import { NextApiRequest, NextApiResponse } from 'next';
import withDebug from '~/backendlib/middleware/with-debug';
import { httpGetHandler } from '~/backendlib/middleware';
import withMongo from '../../../backendlib/middleware/with-mongo';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  const data = { appVersion: '1.0.11', appBuildNumber: 12, isForceUpdate: false };
  res.status(200).json(data);
};

export default withDebug(httpGetHandler(withMongo(handler)));
