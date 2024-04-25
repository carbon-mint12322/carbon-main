const { writeFile } = require('fs');
const glob = require('glob');

// Promise version of glob
const pglob = (pattern) =>
  new Promise((res, rej) => glob(pattern, {}, (err, files) => (err ? rej(err) : res(files))));

// Promise version of writeFile
const pwriteFile = (fn) => (content) =>
  new Promise((res, rej) => writeFile(fn, content, (err) => (err ? rej(err) : res(null))));

const filter = (pred) => (arr) => arr.filter(pred);
const map = (func) => (arr) => arr.map(func);
const positiveRegexTest = (re) => (str) => re.test(str);
const negativeRegexTest = (re) => (str) => !re.test(str);

const removePagesPrefix = (x) => x.replace(/^pages/, '');
const removePageExt = (x) => x.replace(/\.[jt]sx$/, '');
const removeIndexSuffix = (x) => x.replace(/\/index$/, '');

const excludeApi = negativeRegexTest(/^\/api/);
const excludeUnderscore = negativeRegexTest(/\/_.*\.?sx/);

const adminTest = (fn) => /^admin/.test(fn);

const categorize = (pages) => {
  const public = pages.filter(positiveRegexTest(/^\/public/));
  const operator = pages.filter(positiveRegexTest(/^\/farmbook\/operator\//)).concat(public);
  const agent = pages.filter(positiveRegexTest(/^\/(farmerapp)|(farmbook)/)).concat(operator);
  const admin = pages.filter(positiveRegexTest(/^\/admin/)).concat(agent);

  const LOGIN_PAGE = `/${process.env.APP_ID || ''}/public/login`;
  return { LOGIN_PAGE, admin, agent, operator, public };
};

const jsonify = (x) => JSON.stringify(x, null, 2);

pglob('pages/**/*[jt]sx')
  .then(filter(excludeUnderscore))
  .then(map(removePagesPrefix))
  // .then(filter(excludeApi))
  .then(map(removePageExt))
  .then(map(removeIndexSuffix))
  .then(categorize)
  .then(jsonify)
  .then(pwriteFile('./static/rbac/acl.json'))
  .then(console.log);
