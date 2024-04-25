import { NextApiRequest, NextApiResponse } from 'next';

import listHandler from './list';
import createHandler from './create';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
      responseLimit: false,
    },
  },
};

const fourOhFour = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(404).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'POST'
    ? createHandler(req, res)
    : req.method === 'GET'
    ? listHandler(req, res)
    : fourOhFour(req, res);

export default handler;
