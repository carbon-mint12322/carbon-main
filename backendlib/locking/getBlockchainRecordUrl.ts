import { IBlockchainRecord } from '@carbon-mint/qrlib/build/main/lib/types/primitives-types';

function getBlockchainRecordUrl({ transactionHash }: IBlockchainRecord) {
  return `https://mumbai.polygonscan.com/tx/${transactionHash}`;
}

export default getBlockchainRecordUrl;
