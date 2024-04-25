const reviewFail = (ctx) => {
  ctx.logger.debug('review failed');
  ctx.data.status = 'Review Failed';
  ctx.data.statusNotes = ctx?.event?.data?.notes;
};

export default reviewFail;
