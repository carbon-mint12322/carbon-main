import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';

export default async function validateSession(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return session;
}
