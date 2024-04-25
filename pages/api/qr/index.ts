import { NextApiRequest, NextApiResponse } from 'next';
import qrlib from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = getBaseUrl(req);
  const url = req.query.url;
  const content = `${baseUrl}${url}`.replace('//', '/');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'max-age=604800, s-maxage=604800, stale-while-revalidate');
  qrlib.toFileStream(res, content);
}

function getBaseUrl(req: NextApiRequest): string {
  const host: string = req.headers.host || 'localhost';
  const proto = /^localhost/.test(host) ? 'http' : 'https';
  return `${proto}://${host}`;
}
