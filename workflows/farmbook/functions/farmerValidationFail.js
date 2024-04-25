const fail = (ctx) => {
  ctx.logger.debug('validation failed');
  ctx.data.status = 'Validation Failed';
  ctx.data.statusNotes = ctx?.event?.data?.notes;
};

export default fail;
