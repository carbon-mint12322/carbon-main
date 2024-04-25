const YAML = require('yaml');
const { preadFile } = require('./fsutil');

const parse = (yaml) => YAML.parse(yaml);
const jsonify = (x) => JSON.stringify(x, null, 2);
const print = (x) => console.log(x);

preadFile(process.argv[2]).then(parse).then(jsonify).then(print);
