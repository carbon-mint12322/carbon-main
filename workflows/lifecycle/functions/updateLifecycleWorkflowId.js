const update = (ctx) => {
  ctx.logger.debug('setting workflow ID');
  console.log('Workflow ID is', ctx.wf.id);
  ctx.data.lifecycleWorkflowId = ctx.wf.id;
};

export default update;
