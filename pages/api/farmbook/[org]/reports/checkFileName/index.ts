// Generated API code - model instance root for farmer
import { NextApiRequest, NextApiResponse } from 'next';

import get from './get';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'DELETE'
    ? fourOhFive(req, res)
    : req.method === 'GET'
    ? get(req, res)
    : req.method === 'POST'
    ? fourOhFive(req, res)
    : fourOhFive(req, res);

export default handler;
