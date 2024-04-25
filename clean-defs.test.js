const fs = require('fs');
const filename = './test.json';
const { yamlWithInclude } = require('./tools/yaml-include');
const { cleanupDefinitions } = require('./tools/cleanup-defs');
const { preadFile } = require('./tools/fsutil');

async function main() {
  const src = './specs/jsonschemas/src/domain/landparcel.yaml';

  const yamlText = await preadFile(filename);
  const json = await yamlWithInclude(src)(yamlText);

  const newSchema = cleanupDefinitions(json);
  console.log(newSchema);
}

main();
