import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

export const httpPutHandler =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
      res.status(405).send({ message: 'Only PUT requests allowed' });
      return;
    }
    await handler(req, res);
  };
