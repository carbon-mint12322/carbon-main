import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

const withDebug = (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('[DBG][method] ', req.method);
  await handler(req, res);
  console.log('[DBG][DONE]');
};

export default withDebug;
