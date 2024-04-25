const validationPass = (ctx) => {
  ctx.logger.debug('validation passed');
  ctx.data.status = 'Approved';
  ctx.data.statusNotes = ctx?.event?.data?.notes;
};

export default validationPass;
