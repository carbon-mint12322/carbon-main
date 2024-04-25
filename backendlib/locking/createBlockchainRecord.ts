import { createRecord } from '~/smart-contracts/src/EvLockerApi';

import { IBlockchainRecord } from '@carbon-mint/qrlib/build/main/lib/types/primitives-types';

async function createBlockchainRecord(evidenceInput: any): Promise<IBlockchainRecord> {
  // console.log('createBlockchainRecord', { evidenceInput });
  return createRecord(evidenceInput);
}

export default createBlockchainRecord;
