import { NextApiRequest, NextApiResponse } from 'next';

import deleteHandler from './delete';
import getHandler from './get';
import updateHandler from './update';

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
  req.method === 'DELETE'
    ? deleteHandler(req, res)
    : req.method === 'GET'
    ? getHandler(req, res)
    : req.method === 'PUT'
    ? updateHandler(req, res)
    : fourOhFour(req, res);

export default handler;
