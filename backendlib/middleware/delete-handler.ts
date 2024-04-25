import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

export const httpDeleteHandler =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'DELETE') {
      res.status(405).send({ message: 'Only DELETE requests allowed' });
      return;
    }
    await handler(req, res);
  };
