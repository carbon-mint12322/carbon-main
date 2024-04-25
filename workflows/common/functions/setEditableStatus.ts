const update = (ctx: any) => {
    ctx.logger.debug('setting status');
    ctx.data.status = 'editable';
};

export default update;
