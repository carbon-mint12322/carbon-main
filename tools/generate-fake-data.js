const { faker } = require('@faker-js/faker');
const { readFile, writeFile } = require('fs');
const R = require('ramda');

const generateFakeUsers = (count) =>
  R.range(0, count).map((i) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const _id = `fakeid-${i}`;
    return {
      id: _id,
      _id,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: faker.phone.number(),
      email: `fake-${lastName}@carbonmint.com`,
    };
  });

const pWriteFile = (fn, content) =>
  new Promise((resolve, reject) =>
    writeFile(fn, content, (err) => (err ? reject(err) : resolve('done'))),
  );

const MAX_USERS = 100;
const main = async () => {
  const users = generateFakeUsers(MAX_USERS);
  const data = { users };
  const json = JSON.stringify(data, null, 1);
  await pWriteFile('./static/fake-data.json', json);
  return 'done';
};

main().then(console.log);
