// Generated API code - model instance root for farmer
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteHandler, getHandler, updateHandler } from '~/backendlib/farmbook/apilib';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'DELETE'
    ? deleteHandler(req, res)
    : req.method === 'GET'
    ? getHandler(req, res)
    : req.method === 'POST'
    ? updateHandler(req, res)
    : fourOhFive(req, res);

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
      responseLimit: false,
    },
  },
};
