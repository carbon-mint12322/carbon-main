import { NextApiRequest, NextApiResponse } from 'next';

import updateHandler from './update';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'POST'
    ? res.status(405).send({ error: 'Invalid request' })
    : req.method === 'PUT'
    ? updateHandler(req, res)
    : fourOhFive(req, res);

export default handler;
