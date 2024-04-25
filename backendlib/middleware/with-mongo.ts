import { NextApiRequest, NextApiResponse } from 'next';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Handler } from '../types';

import { connectDB, disconnectDB } from '~/backendlib/db/adapter';

export const withMongo =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB();
    try {
      await handler(req, res);
    } catch (err) {
      res.status(500).send({ msg: 'Server Error' });
    }
    // disconnectDB();
  };

export const withMongoGssp =
  (handler: GetServerSideProps) => async (context: GetServerSidePropsContext) => {
    await connectDB();
    try {
      const result = await handler(context);
      disconnectDB();
      return result;
    } catch (err) {
      disconnectDB();
      throw err;
    }
  };

export default withMongo;
