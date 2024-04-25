const ethers = require('ethers');
const abi = require('~/smart-contracts/artifacts/contracts/CeeToken.sol/CeeToken.json');

/**
 * This function creates a wallet and stores in the context
 * Pre-requisites
 * Contet must have:
 *  - rewardTokens - quantity to reward
 *  - wallet - with address field set
 *
 * Environment must have:
 * ISSUER_PRIV_KEY, CEETOKEN_CONTRACT_ADDRESS
 *
 * Post conditions:
 * - tokens are transferred
 * - transaction receipt is available in context.tokenTransferReceipt
 */
const issueTokens = async (context) => {
  const logger = context.logger;
  const issuerKey = process.env.ISSUER_PRIV_KEY;
  if (!issuerKey) {
    logger.error('No issuer private key');
    throw new Error('Application config error. Set ISSUER_PRIV_KEY');
  }
  logger.debug('Issuer Key ok');
  const contractAddress = process.env.CEETOKEN_CONTRACT_ADDRESS;
  if (!contractAddress) {
    logger.error('No token contract address');
    throw new Error('Application config error. Set CEETOKEN_CONTRACT_ADDRESS');
  }
  logger.debug('contract address ok');
  const issuer = new ethers.Wallet(issuerKey);
  const qty = context.rewardTokens; //number of tokens being awarded

  // TODO: set upper limit

  const toWallet = context.wallet;
  const toAddress = toWallet.address;
  logger.debug('to address: ' + toAddress);

  const CeeToken = new ethers.Contract(contractAddress, abi, issuer);
  const balance = ethers.utils.formatUnits(await CeeToken.balanceOf(issuer.getAddress()));
  if (qty > balance) {
    logger.error('Insufficient funds');
    throw new Error('Insufficient funds');
  }

  logger.info(`Transferring ${qty} tokens`);
  const tx = await CeeToken.transfer(toAddress, ethers.utils.parseUnits('' + qty));
  const receipt = tx.wait();
  logger.info(
    `transfer complete tx hash: ${receipt.transactionHash}, block hash: ${receipt.blockHash}`,
  );
  context.tokenTransferReceipt = receipt;
  return;
};

module.exports = issueTokens;
