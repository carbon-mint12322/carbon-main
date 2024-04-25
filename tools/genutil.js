const Mustache = require('mustache');
const { flatten, uniq } = require('lodash');
const { pexists, preadFile, pmkdir, pwriteFile, pwriteFileNoOverwrite } = require('./fsutil');

const preamblePage = (name, useStatesBlock, useContextsBlock, imports) => `
import React from "react";
import Head from "next/head"

${imports}
import {AppConfigContext} from "~/contexts/AppConfigContext";
import { useGlobalStateCtx } from "~/contexts/GlobalStateCtx";

// Shortcut for react fragment
const Fragment = React.Fragment;
const PlainText = ({text}) => text;

function ${name}(props) {
  const pageCtx = React.useContext(AppConfigContext);
${useContextsBlock}
${useStatesBlock}
  return (
`;

const postamble = `
    </Context.Provider>
  );
}
`;
const exportSection = (name) => `

export default ${name};

`;

const genPage = async (
  //	{name, importsBlock, useStatesBlock, useContextsBlock, jsxBlock, }
  context,
  outfn,
) => await genWithTemplate('tools/templates/reactml-page.js.mustache', outfn, context);

const preambleComponent = (name, importstr) => `
import React from "react";
import Head from "next/head"

${importstr}

// Shortcut for react fragment
const Fragment = React.Fragment;
const PlainText = ({text}) => text;

`;

// Find references to other generated components in props
const findReferencesInProps = (compdef) => {
  const refs = Object.keys(compdef.props)
    .map((name) => compdef.props[name])
    .filter((val) => /\$GEN./.test(val))
    .map((val) => val.replace(/\$GEN./, ''))
    .map((tag) => ({ name: tag, tag, imported: true }));
  return flatten([...refs, ...compdef.children.map(findReferencesInProps)]);
};

const generatePageEndpoint = async (spec) =>
  await genWithTemplateNoOverwrite(
    'tools/templates/pages/model-page-endpoint.tsx.mustache',
    spec.pageEndpoint,
    spec,
  );

const genWithTemplate = async (templateFileName, outFn, context) => {
  const template = await preadFile(templateFileName);
  const code = Mustache.render(template, context);
  await pwriteFile(outFn, code);
  return outFn;
};

const genWithTemplateNoOverwrite = async (templateFileName, outFn, context) => {
  const template = await preadFile(templateFileName);
  const code = Mustache.render(template, context);
  await pwriteFileNoOverwrite(outFn, code);
  return outFn;
};

module.exports = {
  genPage,
  preambleComponent,
  generatePageEndpoint,
  findReferencesInProps,
  exportSection,

  genWithTemplate,
  genWithTemplateNoOverwrite,
};
