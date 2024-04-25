// Generated code - List API
import { NextApiRequest, NextApiResponse } from 'next';
import { httpGetHandler } from '~/backendlib/middleware/get-handler';
import withDebug from '~/backendlib/middleware/with-debug';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    success: true,
  });
};

export default withDebug(httpGetHandler(handler));
