const reviewPass = (ctx) => {
  ctx.logger.debug('review passed, under validation');
  ctx.data.status = 'Under Validation';
  ctx.data.statusNotes = ctx?.event?.data?.notes;
};

export default reviewPass;
