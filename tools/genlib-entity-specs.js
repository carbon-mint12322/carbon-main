const { flatten, uniqBy, once, uniq, values } = require('lodash');
const { preadFile } = require('./fsutil');
const { listFiles } = require('./lib');
const { genWithTemplate } = require('./genutil');
const { yamlWithInclude } = require('./yaml-include');

async function processEntityDef(parsed) {
  // json schema processing

  return parsed;
}

async function genEntity(srcFile) {
  const content = await preadFile(srcFile);
  const parsed = await yamlWithInclude(srcFile)(content);
  const def = await processEntityDef(parsed);
  console.log('Entity DEF: ', srcFile, def.jsonschema);
}

const wfWildcard = 'specs/jsonschemas/src/entities/**/*.yaml';
function main(glob = wfWildcard) {
  return listFiles('.', glob).then((sources) => Promise.all(sources.map(genEntity)));
}

module.exports = { main };
