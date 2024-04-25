import { SHA3 } from 'sha3';

const processor = (ctx) => {
  const data = ctx.event?.data || ctx.data;
  ctx.logger.debug('calculating hash for ' + JSON.stringify(data));
  const fileData = data.file;
  const hash = new SHA3(512);
  hash.update(fileData);
  const digest = hash.digest('hex');
  ctx.logger.debug('hash digest is ' + digest);
  ctx.data = {
    ...ctx.event.data,
    hash: digest,
  };
  return ctx;
};

export default processor;
