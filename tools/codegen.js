const { listFiles, generate } = require('./lib');
const fg = require('fast-glob');
const { main: wfCodegen } = require('./codegenWf');

const defaultWildcard = 'specs/{src,gen}/**/*.rtml.{coffee,yaml,yml,json,xml}';

const reactmlCodegen = async (glob = defaultWildcard) =>
  listFiles('.', glob).then((sources) => Promise.all(sources.map(generate)));

const main = async () => {
  console.log('Generating workflow...');
  await wfCodegen();
  console.log('Generating ReactML files...');
  const sources = await listFiles('.', defaultWildcard);

  const genResult = await Promise.all(sources.map(generate));
  await reactmlCodegen();
};

main();
