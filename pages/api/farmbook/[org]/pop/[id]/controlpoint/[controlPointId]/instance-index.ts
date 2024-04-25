// NOT GENERATED
import { NextApiRequest, NextApiResponse } from 'next';

import getHandler from './get';
import updateHandler from './update';
import deleteHandler from './delete';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'DELETE'
    ? deleteHandler(req, res)
    : req.method === 'GET'
    ? getHandler(req, res)
    : req.method === 'PUT'
    ? updateHandler(req, res)
    : fourOhFive(req, res);

export default handler;
