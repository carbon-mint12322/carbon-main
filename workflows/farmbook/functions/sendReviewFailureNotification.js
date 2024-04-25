const step = (ctx) => {
  ctx.logger.debug('sending notification for approval');
  ctx.data.status = 'Review Failed';
};

export default step;
