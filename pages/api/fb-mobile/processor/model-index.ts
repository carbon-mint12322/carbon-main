import { NextApiRequest, NextApiResponse } from 'next';

import listHandler from './list';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'POST'
    ? fourOhFive(req, res)
    : req.method === 'GET'
    ? listHandler(req, res)
    : fourOhFive(req, res);

export default handler;
