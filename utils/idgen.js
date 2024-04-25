const idgenerator = function* (start = new Date().getTime()) {
  var id;
  id = start + 1;
  while (true) {
    yield id;
    id += 1;
  }
};
const generator = idgenerator();
const nextId = () => generator.next().value;

module.exports = nextId;
