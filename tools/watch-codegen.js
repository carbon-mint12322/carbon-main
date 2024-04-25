// Generated by CoffeeScript 2.7.0
(function () {
  var chokidar, fs, generate, generateNew, jsonSchemaGen, listFiles, main, removeGenerated;

  fs = require('fs');
  chokidar = require('chokidar');
  ({ listFiles, generate } = require('./lib'));
  jsonSchemaGen = require('./codegen-json-schema');
  const { codegenWf } = require('./codegenWf');

  removeGenerated = (path) => {
    var genfile;
    genfile = path.replace('/src', '/gen').replace(/.yaml$|.coffee$|.json$|.xml$/, '.jsx');
    return fs.unlink(genfile, (err) => {
      if (err) {
        console.error('Unable to remove file ' + genfile);
      }
      return console.log('file removed', genfile);
    });
  };

  generateNew = (path) => {
    console.log('added', path);
    return generate(path);
  };

  main = () => {
    var glob1, glob2, watcher1, watcher2;
    // ReactML watcher
    glob1 = 'specs/{src,gen}/**/*.rtml.{coffee,yaml,json,xml}';
    watcher1 = chokidar.watch(glob1);
    console.log('watching', glob1);
    watcher1.on('change', generate);
    watcher1.on('add', generateNew);
    watcher1.on('unlink', removeGenerated);
    // JSON Schema src (YAML) watcher
    glob2 = 'specs/jsonschemas/src/**/*.yaml';
    watcher2 = chokidar.watch(glob2);
    console.log('watching', glob2);
    watcher2.on('change', jsonSchemaGen.generateOne);
    watcher2.on('add', jsonSchemaGen.generateOne);

    // Workflow def (YAML) watcher
    glob3 = 'specs/workflows/src/**/*.yaml';
    watcher3 = chokidar.watch(glob3);
    console.log('watching', glob3);
    watcher3.on('change', codegenWf);
    watcher3.on('add', codegenWf);
  };

  // watcher2.on "unlink", removeGenerated
  main();
}.call(this));