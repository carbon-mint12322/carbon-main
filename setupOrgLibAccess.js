require('dotenv').config();

const os = require('os');

const fs = require('fs');

const token = process.env.GITHUB_AUTH_TOKEN || false;

if (!token) throw new Error('Please set GITHUB_AUTH_TOKEN in .env');

try {
  fs.writeFileSync(`${os.homedir()}/.npmrc`, `//npm.pkg.github.com/:_authToken=${token}`);
} catch (err) {
  console.error(err);
  throw new Error('File not written properly.');
}

console.log('Setup sucessfull.');
