import { ContractReceipt, Wallet, providers } from "ethers";
import { EvidenceRecords } from "../typechain-types";
import { EvidenceRecords__factory } from "../typechain-types/factories/contracts/EvidenceRecords__factory";

export type BlockchainConfig = {
  providerUrl: string;
  providerName: string;
  appWalletPrivKey: string;
  contractAddress: string;
}
export type EvidenceInput = EvidenceRecords.RecordStruct;


const getBcConfig = () : BlockchainConfig => {
  const appWalletPrivKey = process.env.APP_WALLET_PRIV_KEY;
  if (!appWalletPrivKey) {
    throw new Error("APP_WALLET_PRIV_KEY not set in environment");
  }

  //"0xf467e74c8e026F2A1a397eC66B42b0f35dFB4916"; // mumbai-specific
  const contractAddress = process.env.RECORD_CONTRACT_ADDRESS; 
  if (!contractAddress) {
    throw new Error("RECORD_CONTRACT_ADDRESS not set in environment");
  }
  // e.g. https://polygon-mumbai.g.alchemy.com/v2/...
  const providerUrl = process.env.BLOCKCHAIN_URL; 
  if (!providerUrl) {
    throw new Error("BLOCKCHAIN_URL not set in environment");
  }
  // e.g. "mumbai"
  const providerName = process.env.BLOCKCHAIN_NAME; 
  if (!providerName) {
    throw new Error("BLOCKCHAIN_NAME not set in environment");
  }
  return { providerUrl, providerName, appWalletPrivKey, contractAddress, };
}

const getAppWallet = (config: BlockchainConfig = getBcConfig()): Wallet => {
  const privKey = config.appWalletPrivKey; //process.env.APP_WALLET_PRIV_KEY;
  const provider = new providers.JsonRpcProvider(
    config.providerUrl
    //, config.providerName
  );
  const wallet = new Wallet(privKey, provider);

  return wallet;
}

const _createRecord = async (evidence: EvidenceInput, contractAddress: string, wallet: Wallet) : Promise<ContractReceipt> => {
    const contract: EvidenceRecords = EvidenceRecords__factory.connect(contractAddress, wallet);
    const evidence2 = (evidence.recipient === "") 
      ? {...evidence, recipient: wallet.address}
      : evidence;
    const tx = await contract.createRecord(evidence2, wallet.address);
    const receipt = await tx.wait(2);
    return receipt;
  };

export const contractReceiptDetails = (receipt: ContractReceipt) => ({
  hash:receipt.transactionHash,
  link: `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`,
  blockchainReceipt: receipt,
})


export const createRecord = (input: EvidenceInput, config = getBcConfig()) =>
  _createRecord(input, config.contractAddress, getAppWallet(config));

/*
export const verify = (uri, currentHash) => {

}

export const lookup = (uri) => {

} 
*/