import locker from './lockingPipeline';
import type { WorkflowContext } from '../workflow/types';

async function lockRecord(wfctx: WorkflowContext) {
  const { value: result }: any = await locker(wfctx);
  wfctx.logger.info('Locking result', result);
}

export default lockRecord;
