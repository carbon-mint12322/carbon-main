const ethers = require('ethers');

// This function creates a wallet and stores in the context
const createWallet = (context) => {
  const { address, mnemonic } = ethers.Wallet.createRandom();
  // console.log('address:', address, "mnemonic: ", mnemonic.phrase)
  context.wallet = {
    address,
    mnemonic: mnemonic.phrase,
  };
};

module.exports = createWallet;
