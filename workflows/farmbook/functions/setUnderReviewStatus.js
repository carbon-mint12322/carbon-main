const update = (ctx) => {
  ctx.logger.debug('setting validation status');
  ctx.data.validationWorkflowId = ctx.wf.id;
  ctx.data.status = 'Under Review';
  ctx.data.statusNotes = ctx?.event?.data?.notes;
};

export default update;
