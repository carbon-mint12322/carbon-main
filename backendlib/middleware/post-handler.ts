import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

export const httpPostHandler =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }
    await handler(req, res);
  };
