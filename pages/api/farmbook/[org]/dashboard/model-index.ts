import { NextApiRequest, NextApiResponse } from 'next';

import getHandler from './get';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'GET' ? getHandler(req, res) : fourOhFive(req, res);

export default handler;
