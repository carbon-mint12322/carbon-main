import { NextApiRequest, NextApiResponse } from 'next';
import { Handler } from '../types';

export const withTiming =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const start = new Date().getTime();
    const result = await handler(req, res);
    const end = new Date().getTime();
    console.log(`took ${end - start} ms`);
    return result;
  };
