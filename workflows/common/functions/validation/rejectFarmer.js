const rejectFarmer = (ctx) => {
  ctx.logger.debug('rejecting farmer');
  ctx.data.status = 'REJECTED';
};

export default rejectFarmer;
