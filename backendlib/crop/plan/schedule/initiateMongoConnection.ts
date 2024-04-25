import { connectDb } from '@carbon-mint/jobs';

export async function initiateMongoConnection() {
  await connectDb({
    mongoConfig: {
      connectionUrl: process.env.DATABASE_URL ?? '',
    },
  });
}
