import { NextApiRequest, NextApiResponse } from 'next';

import { bulkUpdateHandler } from '~/backendlib/farmbook/apilib';

const fourOhFive = (req: NextApiRequest, res: NextApiResponse) =>
  res.status(405).send({ error: 'Invalid request' });

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  req.method === 'POST' ? bulkUpdateHandler(req, res) : fourOhFive(req, res);

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
      responseLimit: false,
    },
  },
};
