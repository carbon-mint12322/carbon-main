import { SHA3 } from 'sha3';
import { expect } from "chai";
import { sha256 } from "ethers/lib/utils";
import ethers from "ethers";
import { nextId } from "./util";
import { BlockchainConfig, createRecord, contractReceiptDetails } from '../src/EvLockerApi';
import { EvidenceRecords } from '../typechain-types';
import networkConfig from "../networkConfig";

describe("API Test", () => {
  const config: BlockchainConfig = {
    providerUrl: networkConfig.networks.mumbai.url,
    providerName: "mumbai",
    appWalletPrivKey: networkConfig.appPrivKey,
    contractAddress: "0xf467e74c8e026F2A1a397eC66B42b0f35dFB4916",
  };
  it("store record", async () => {
    const evidence: EvidenceRecords.RecordStruct = {
      uri: "/evidence/12345" + nextId(),
      userId: "user1234",
      userName: "somebody",
      latitude: 123, longitude: 456,
      ts: 1234567,
      hash: "123123123324234sdfdf",
      recipient: "",
      locked: true
    };
    const receipt = await createRecord(evidence, config);
    
    const receiptDetails = contractReceiptDetails(receipt);
    expect(receiptDetails.hash).to.not.be.undefined;
    expect(receiptDetails.link).to.not.be.undefined;
    // console.log(receiptDetails.link);
  });
  it("store record", async () => {
    const evidence: EvidenceRecords.RecordStruct = {
      uri: "/evidence/12345" + nextId(),
      userId: "user1234",
      userName: "somebody",
      latitude: 123, longitude: 456,
      ts: 1234567,
      hash: "123123123324234sdfdf",
      recipient: "",
      locked: true
    };
    const receipt = await createRecord(evidence, config);

    const receiptDetails = contractReceiptDetails(receipt);
    expect(receiptDetails.hash).to.not.be.undefined;
    expect(receiptDetails.link).to.not.be.undefined;
    console.log(receiptDetails.link);
  });
});
