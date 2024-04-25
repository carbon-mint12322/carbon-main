import { createRecord, contractReceiptDetails } from '../../../smart-contracts/src/EvLockerApi';

const processor = async (ctx) => {
  const data = ctx.data;
  // ctx.logger.debug('locking ' + JSON.stringify(ctx, null,2));
  const input = {
    uri: data.uri,
    userId: data.userId,
    userName: data.userName,
    latitude: data.latitude,
    longitude: data.longitude,
    ts: data.longitude,
    hash: data.hash,
    recipient: '',
    locked: true,
  };
  const receipt = await createRecord(input);
  ctx.data.lock = contractReceiptDetails(receipt);
  console.log('transaction link', ctx.data.lock.link);
  return ctx;
};

export default processor;
