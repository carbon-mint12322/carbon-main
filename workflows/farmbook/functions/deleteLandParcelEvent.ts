import { WorkflowContext } from '~/backendlib/workflow/types';

export default (ctx: WorkflowContext) => (ctx.data.status = 'archived');