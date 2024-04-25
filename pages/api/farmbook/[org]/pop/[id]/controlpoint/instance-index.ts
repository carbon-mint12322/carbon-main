// NOT GENERATED
import { NextApiRequest, NextApiResponse } from 'next';

import createHandler from './create';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'POST' ? createHandler(req, res) : fourOhFive(req, res);

export default handler;
