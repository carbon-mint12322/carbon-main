// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Based on this SO answer: https://stackoverflow.com/a/58570989

import "hardhat/console.sol";

contract EvidenceRecords {

    struct Record {
      string uri;
      string hash;

      string userId; // Person entering the evidence
      string userName;

      // Location of the event
      // for geoPoint(79.123, -110.000287), use(79123000, -110000287).
      int32  latitude;
      int32  longitude;

      // timestamp of the event
      int32  ts; //timestamp, seconds from epoch

      // intended recipient. Use the address of the creating wallet
      // if not available
      address recipient;
      bool locked;
    }

    mapping(string => Record) public evidenceLookup;
    string[] public uriList;

    event LogNewRecord(address sender, string evidence, address recipient);
    event LogRecordUpdate(address sender, string evidence, address recipient);
    event LogLocked(address sender, string evidence);

    function isExists(string memory uri)
    public view returns(bool isIndeed) {
        // console.log(evidenceLookup[uri].recipient);
        return evidenceLookup[uri].recipient != address(0);
    }

    function isLocked(string memory uri)
    public view returns(bool isIndeed) {
        require(isExists(uri), "DOES_NOT_EXIST");
        Record memory entry = evidenceLookup[uri];
        return entry.locked;
    }

    function createRecord(Record memory evidence, address recipient)
    public {
        require(recipient != address(0), "Invalid recipient");
        require(!isExists(evidence.uri), "EXISTS");
        evidenceLookup[evidence.uri] = Record({
          uri: evidence.uri,
          hash: evidence.hash,
          userId: evidence.userId,
          userName: evidence.userName,
          latitude: evidence.latitude,
          longitude: evidence.longitude,
          ts: evidence.ts,
          recipient: recipient,
          locked: evidence.locked
        });
        uriList.push(evidence.uri);
        emit LogNewRecord(msg.sender, evidence.uri, recipient);
        if (evidence.locked) {
            emit LogLocked(msg.sender, evidence.uri);
        }
    }

    function updateRecord(Record memory evidence, address recipient)
    public {
        require(recipient != address(0), "Invalid recipient");
        require(isExists(evidence.uri), "DOES_NOT_EXIST");
        require(!isLocked(evidence.uri), "LOCKED");
        evidenceLookup[evidence.uri] = Record({
          uri: evidence.uri,
          hash: evidence.hash,
          userId: evidence.userId,
          userName: evidence.userName,
          latitude: evidence.latitude,
          longitude: evidence.longitude,
          ts: evidence.ts,
          recipient: recipient,
          locked: evidence.locked
        });
        emit LogRecordUpdate(msg.sender, evidence.uri, recipient);
        if (evidence.locked) {
            emit LogLocked(msg.sender, evidence.uri);
        }
    }

    function lockRecord(string memory uri)
    public {
        require(evidenceLookup[uri].recipient == msg.sender);
        require(evidenceLookup[uri].locked == false);
        evidenceLookup[uri].locked = true;
        emit LogLocked(msg.sender, uri);
    }

    function isUserRecord(string memory uri, address user)
    public view returns(bool) {
        if(!isExists(uri)) return false;
        if(evidenceLookup[uri].recipient != user) return false;
        return evidenceLookup[uri].locked;
    }

    function lookup(string memory uri)
    public view returns(Record memory) {
        require(isExists(uri), "DOES_NOT_EXIST");
        Record memory entry = evidenceLookup[uri];
        return entry;
    }
}
