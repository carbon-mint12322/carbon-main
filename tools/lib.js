// Generated by CoffeeScript 2.7.0
(function () {
  var YAML,
    coffee,
    coffeeEval,
    fg,
    findReferencesInProps,
    genFromSpec,
    genWithTemplate,
    generatePageDataFromFunction,
    generatePageDataGraphQL,
    generatePageEndpoint,
    generateYaml,
    getFuncNameFromDsFunc,
    interpret,
    interpretLayout,
    jsonEval,
    jsonify,
    listComponents,
    listFiles,
    listImports,
    maybeGenPage,
    normalize,
    pWriteFile,
    preambleComponent,
    pwriteFile,
    pwriteFileNoOverwrite,
    readFile,
    render,
    renderImportBlock,
    srcToObject,
    uniq,
    writeFile,
    xmlEval,
    xmlParse,
    yamlEval;
  const { preadFile } = require('./fsutil');
  ({
    normalize,
    render,
    interpretLayout,
    jsonify,
    listComponents,
    listImports,
    renderImportBlock,
  } = require('./rtml'));

  ({
    preambleComponent,
    findReferencesInProps,
    generatePageEndpoint,
    genWithTemplate,
  } = require('./genutil'));

  ({ readFile, writeFile } = require('fs'));

  ({ xmlParse } = require('./xml-parse'));

  ({ uniq } = require('lodash'));

  YAML = require('yaml');

  fg = require('fast-glob');

  coffee = require('coffeescript');

  ({ pwriteFile, pwriteFileNoOverwrite } = require('./fsutil'));

  pWriteFile = pwriteFile; // Synonyms

  listFiles = (root, pattern) => {
    return fg([`${root}/${pattern}`]);
  };

  interpret = function (content, srcfile) {
    var err, err2, spec;
    try {
      spec = srcToObject(content, srcfile);
      if (!spec.name && spec.props && spec.props.name) {
        spec.name = spec.props.name;
      }
      // interprets layout specs
      return interpretLayout(spec);
    } catch (error) {
      err = error;
      err2 = 'Unable to parse UI specification from file ' + srcfile;
      console.error(err2);
      throw err;
    }
  };

  genFromSpec = async (content, srcfile) => {
    var outfn, spec, yamlFile;
    spec = interpret(content, srcfile);
    outfn = srcfile
      .replace(/specs\/src/, 'specs/gen')
      .replace(/.coffee$|.yaml$|.yml$|.json$|.xml$/, '.jsx');
    // console.log("[JSX] " + outfn);
    await render(spec, outfn);
    await maybeGenPage(spec);
    yamlFile = srcfile
      .replace(/specs\/src|specs\/gen/, 'gen-yaml')
      .replace(/.coffee$|.json$|.xml$/, '.yaml');
    return await generateYaml(spec, yamlFile);
  };

  maybeGenPage = async (spec) => {
    var ref, ref1;
    if (!spec.pageName) {
      return;
    }
    if (((ref = spec.datasource) != null ? ref.type : void 0) === 'graphql') {
      await generatePageDataGraphQL(spec);
    }
    if (((ref1 = spec.datasource) != null ? ref1.type : void 0) === 'function') {
      await generatePageDataFromFunction(spec);
    }
    await genWithTemplate(
      'tools/templates/pages/model-main/ui.tsx.mustache',
      `gen/pages/${spec.pageName}/ui.tsx`,
      spec,
    );
    // Page end point refers to the entry point for a page in the
    // /pages/... hierarchy
    if (spec.pageEndpoint) {
      return await generatePageEndpoint(spec);
    }
  };

  generatePageDataFromFunction = (spec) => {
    var context,
      functionName,
      importPath,
      importedFunc,
      importstr,
      outfn,
      ref,
      ref1,
      ref2,
      roles,
      template;
    if (
      ((ref = spec.datasource) != null ? ref.type : void 0) === 'function' &&
      ((ref1 = spec.datasource) != null ? ref1.import : void 0)
    ) {
      importstr = (ref2 = spec.datasource) != null ? ref2.import : void 0;
    }
    if (!importstr) {
      return '';
    }
    [importPath, importedFunc] = importstr.split('#');
    importedFunc = importedFunc || 'default';
    functionName = importedFunc || 'datasource';
    roles = JSON.stringify(spec.datasource.permittedRoles || ['VIEWER']);
    context = { importedFunc, importedFunc, importPath, roles, functionName };
    template = 'tools/templates/pages/model-main/data.tsx.mustache';
    outfn = `gen/pages/${spec.pageName}/data.ts`;
    return genWithTemplate(template, outfn, context);
  };

  generatePageDataGraphQL = function (spec) {
    var context, outfn, query, template, uri, variables;
    template = 'tools/templates/pages/model-main/graphql-data.tsx.mustache';
    outfn = `gen/pages/${spec.pageName}/data.ts`;
    ({ query, uri, variables } = spec.datasource);
    context = {
      uri,
      variables: jsonify(variables || {}),
      query,
    };
    return genWithTemplate(template, outfn, context);
  };

  getFuncNameFromDsFunc = (spec) => {
    var file, func, importstr, ref, ref1, ref2;
    if (
      ((ref = spec.datasource) != null ? ref.type : void 0) === 'function' &&
      ((ref1 = spec.datasource) != null ? ref1.import : void 0)
    ) {
      importstr = (ref2 = spec.datasource) != null ? ref2.import : void 0;
    }
    if (!importstr) {
      return '';
    }
    [file, func] = importstr.split('#');
    if (!func || func === '') {
      return 'datasource';
    } else {
      return func;
    }
  };

  generateYaml = async (spec, destfile) => {
    // console.log(`[YAML] ${destfile}`);
    return await pWriteFile(destfile, YAML.stringify(spec));
  };

  coffeeEval = coffee.eval;

  yamlEval = YAML.parse;

  jsonEval = JSON.parse;

  xmlEval = xmlParse;

  srcToObject = (code, srcfile) => {
    if (/.xml$/.test(srcfile)) {
      return xmlEval(code);
    }
    if (/.coffee$/.test(srcfile)) {
      return coffeeEval(code);
    }
    if (/.yaml$|.yml$/.test(srcfile)) {
      return yamlEval(code);
    }
    if (/.json$/.test(srcfile)) {
      return jsonEval(code);
    }
  };

  const generate = async (srcfile) => {
    try {
      return genFromSpec(await preadFile(srcfile), srcfile);
    } catch (error) {
      return console.log(error);
    }
  };

  module.exports = { listFiles, generate, genFromSpec, srcToObject };
}.call(this));