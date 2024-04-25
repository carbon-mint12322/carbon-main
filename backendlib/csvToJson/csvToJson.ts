const csv = require('csvtojson');

const csvToJson = async (csvFilePath: string): Promise<{ [key: string]: string }[]> => {
  return csv().fromFile(csvFilePath);
};

export { csvToJson };
