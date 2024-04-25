import { getJobById } from '@carbon-mint/jobs';

/**
 * Can only reschedule notification if the job not completed
 *
 */
export async function isJobCompleted(jobId: string): Promise<boolean> {
  const job = await getJobById(jobId);

  return !!(job && typeof job.completedAt === 'string' && job.completedAt.length);
}
