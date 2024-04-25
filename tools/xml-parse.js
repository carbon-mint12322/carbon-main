// const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const YAML = require('yaml');
var { xml2js } = require('xml-js');

const xmlParse = (code) => {
  const options = {
    nativeTypeAttributes: true,
    trim: true,
  };
  const result = mapper(xml2js(code, options));
  const root = result.children[0];
  if (!root.name) {
    throw new Error('name attribute required at the root tag');
  }
  return root;
};

const mapper = (node) => {
  if (Array.isArray(node)) return node.map(mapper);
  if (node.type === 'text') return node.text;
  const name = node.attributes && node.attributes.name;
  const importPath = node.attributes && node.attributes.importPath;
  if (node.attributes) {
    delete node.attributes.name;
    delete node.attributes.importPath;
  }
  const props = {
    ...node.attributes,
  };
  const spec = {
    tag: node.name || '__comment__',
    name,
    importPath,
    props,
    children: (node.elements || []).map(mapper).filter((n) => n.tag !== '__comment__'),
  };

  return spec;
};

const test = async () => {
  const xmlstr = `
<?xml version="1.0" encoding="utf-8"?>
  <If importPath="~/components/lib/If" name="MyComponent" value="$p.someFlag">
    <Grid item="true" xs="3">
      <div> Logo here </div>
    </Grid>
    <Grid item="true" xs="6">
      <div> Title here </div>
    </Grid>
    <Grid item="true" xs="3">
      <div color="red"> Menu here </div>
    </Grid>
  </If>
`;
  const divstr = `<div width="3">
    <span>test</span>
  </div>`;

  console.log(YAML.stringify(xmlParse(xmlstr)));
};

// test();

module.exports = { xmlParse };
