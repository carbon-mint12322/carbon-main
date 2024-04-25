const fs = require('fs');
const fg = require('fast-glob');
const { promisify } = require('util');
const path = require('path');

const pexists = promisify(fs.exists);
const _pwriteFile = promisify(fs.writeFile);

const mkdirIfNeeded = async (filePath) => {
  const dirname = path.dirname(filePath);
  const isExists = await pexists(dirname);
  if (!isExists) {
    await pmkdir(dirname);
  }
};

const pwriteFile = async (fn, content) => {
  await mkdirIfNeeded(fn);
  return _pwriteFile(fn, content);
};

const preadFile = (fn) =>
  new Promise((resolve, reject) =>
    fs.readFile(fn, (err, content) => (err ? reject(err) : resolve(content.toString()))),
  );

const pwriteFileNoOverwrite = async (fn, content) => {
  if (await pexists(fn)) {
    fn = fn + '.gen';
  }
  await pwriteFile(fn, content);
};

const pmkdir = async (name) =>
  new Promise((resolve, reject) =>
    fs.mkdir(name, { recursive: true }, (err) => (err ? reject(err) : resolve('done'))),
  );

module.exports = {
  pexists,
  preadFile,
  pmkdir,
  pwriteFile,
  pwriteFileNoOverwrite,
};
