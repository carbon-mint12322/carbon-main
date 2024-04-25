const { preadFile, pwriteFile } = require("./fsutil");
const YAML = require('yaml');

const fn = "./tools/entity-ui-schema.yaml";
const parse = (str) => YAML.parse(str);
const jsonify = (obj) => JSON.stringify(obj, null, 2);
const writeFile = (data) => pwriteFile("./gen/entity-ui-schema.json", data);
async function main() {
    const content = await preadFile(fn);
    const schema = parse(content);
    return schema;
}

main().then(jsonify).then(writeFile).catch(console.error);