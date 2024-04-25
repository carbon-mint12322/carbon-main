import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

export const httpGetHandler =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      res.status(405).send({ message: 'Only GET requests allowed' });
      return;
    }
    await handler(req, res);
  };
