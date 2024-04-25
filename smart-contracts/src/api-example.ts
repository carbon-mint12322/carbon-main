import { EvidenceInput, createRecord } from "./EvLockerApi";

export const test = async () => {
  const input: EvidenceInput = {
    uri: "farmbook-uri",
    userId: "123123",
    userName: "chennaiah",
    latitude: 123,
    longitude: 456,
    ts: 1231231,
    hash: "1123123123",
    recipient: "1312312",
    locked: true
  };


  return createRecord(input)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

};
