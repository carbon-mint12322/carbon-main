const approveFarmer = (ctx) => {
  ctx.logger.debug('approving farmer');
  ctx.data.status = 'APPROVED';
};

export default approveFarmer;
