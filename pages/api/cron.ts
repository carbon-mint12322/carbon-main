require('dotenv').config();
import { connectDb, runJobs } from '@carbon-mint/jobs';
import { getUnixTime } from '@carbon-mint/jobs/dist/helper/Utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { initiateMongoConnection } from '~/backendlib/crop/plan/schedule';
import SentryException from '~/backendlib/sentry/SentryException';
import SentryMessage from '~/backendlib/sentry/SentryMessage';

export default async function cronHandler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  SentryMessage(`Cron Api initiated on ${getUnixTime()}`, 'log');

  const apiKey = process.env.VERCEL_CRON_API_KEY || false;

  if (!apiKey) {
    return res.status(401).send('Api Key invalid.');
  }

  if (!req.query.key) {
    return res.status(401).send('Auth key invalid.');
  }

  if (req.query.key !== apiKey) {
    return res.status(401).send('Unauthorized.');
  }

  try {
    // Setting up mongoose db connection if not already set.
    await initiateMongoConnection();

    let canRun = true;

    SentryMessage(`Jobs processing initiated on ${getUnixTime()}`, 'log');

    while (canRun) {
      const jobSize = getJobBatchSize();

      SentryMessage(`${jobSize} Job(s) taken for processing on ${getUnixTime()}`, 'log');

      // TODO : add subtype of job to run certain types of job at certain time
      const result = await runJobs(jobSize);

      SentryMessage(
        `${jobSize} Job(s) processed with result : ${result} on ${getUnixTime()}`,
        'log',
      );

      canRun = result !== 'no_more_job';

      await sleep();
    }
  } catch (e) {
    SentryException(e);
    console.log(e);
  }

  SentryMessage(`Cron Api call completed on ${getUnixTime()}`, 'log');

  return res.status(200).json({ success: true });
}

function sleep(seconds = 1): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
}

function getJobBatchSize(): number {
  return parseInt(process.env.JOB_BATCH_SIZE ?? '20');
}
