import { NextApiRequest, NextApiResponse } from 'next';
import { JsonHandlerWithApi } from '../types';

export const jsonHandler =
  (handler: JsonHandlerWithApi) => async (req: NextApiRequest, res: NextApiResponse, api: any) => {
    const result: object = await handler(req, api);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  };

export const jsonWithCacheHandler =
  (cacheTime: number, handler: JsonHandlerWithApi) =>
  async (req: NextApiRequest, res: NextApiResponse, api: any) => {
    const result: object = await handler(req, api);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', `max-age=${cacheTime} s-maxage=60, stale-while-revalidate`);
    res.status(200).json(result);
  };
