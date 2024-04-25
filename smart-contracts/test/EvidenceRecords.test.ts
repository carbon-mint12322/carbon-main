// @ts-ignore
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SHA3 } from 'sha3';
import { expect } from "chai";
import { sha256 } from "ethers/lib/utils";
// @ts-ignore
import { ethers } from "hardhat";
import { nextId } from "./util";

describe("EvidenceRecords", function() {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEvidenceRecordsFixture() {
    // Contracts are deployed using the first signer/account by default
    const [_owner, otherAccount] = await ethers.getSigners();
    const input = {
      uri: "/evidence/12345" + nextId(),
      userId: "user1234",
      userName: "somebody",
      latitude: 123, longitude: 456,
      ts: 1234567,
      hash: "123123123324234sdfdf",
      recipient: otherAccount.address,
      locked: true
    };
    // c  onsole.log(input)
    const factory = await ethers.getContractFactory("EvidenceRecords");
    const records = await factory.deploy();
    await records.deployed();
    return { records, input };
  }

  describe("Functionality", function() {
    it("Should set the right uri etc metadata", async function() {
      const {
        records, input
      } = await loadFixture(deployEvidenceRecordsFixture);
      const [_owner, otherAccount] = await ethers.getSigners();
      await records.createRecord(input, otherAccount.address);

      // second evidence - change URI
      const input2 = { ...input, uri: "/evidence/" + nextId() };
      await records.createRecord(input2, otherAccount.address);
    });
    it("should not overwrite if a URI is locked", async () => {
      const {
        records, input
      } = await loadFixture(deployEvidenceRecordsFixture);
      const [_owner, otherAccount] = await ethers.getSigners();
      await records.createRecord(input, otherAccount.address);
      try {
        await records.createRecord(input, otherAccount.address);
      } catch (err: any) {
        // same uri, should yield EXISTS error
        expect(/EXISTS/.test(err.message)).to.equal(true);
      }
    });

    it("create, update and lock", async () => {
      const [owner, _otherAccount] = await ethers.getSigners();
      const {
        records, input
      } = await loadFixture(deployEvidenceRecordsFixture);
      const createInput = { ...input, locked: false };
      const updateInput = { ...createInput, latitude: 678, longitude: 9012, };
      await records.createRecord(createInput, owner.address);
      await records.updateRecord(updateInput, owner.address);
      await records.lockRecord(updateInput.uri);
      const isLocked = await records.isLocked(updateInput.uri);
      expect(isLocked).to.equal(true, "Expecting evidence to be locked");
      // Create with same URI should fail
      try {
        await records.createRecord(updateInput, owner.address);
      } catch (err: any) {
        // same uri, should yield EXISTS error
        expect(/EXISTS/.test(err.message)).to.equal(true);
      }

      // update with same URI should fail
      try {
        await records.updateRecord(updateInput, owner.address);
      } catch (err: any) {
        // locked, should yield LOCKED error
        expect(/LOCKED/.test(err.message)).to.equal(true);
      }

    });


    it("lock and verify", async () => {
      const [owner, _otherAccount] = await ethers.getSigners();
      const {
        records, input
      } = await loadFixture(deployEvidenceRecordsFixture);
      const data = '1212312312312312323423-' + Math.random();
      const hash = new SHA3(512);

      hash.update(data);
      const digest = hash.digest('hex');

      const createInput = {
        ...input,
        latitude: 678,
        longitude: 9012,
        hash: digest,
        locked: true,
      };
      await records.createRecord(createInput, owner.address);
      const isLocked = await records.isLocked(createInput.uri);
      expect(isLocked).to.equal(true, "Expecting evidence to be locked");

      const fromBc = await records.lookup(createInput.uri);
      const hash2 = new SHA3(512);
      hash2.update(data);
      expect(fromBc.hash).to.equal(hash2.digest("hex"));
    });

  });


});

