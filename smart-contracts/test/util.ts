// Utility functions

const idgenerator = function*(start = new Date().getTime()) {
  var id;
  id = start + 1;
  while (true) {
    yield id;
    id += 1;
  }
};
const generator = idgenerator();
export const nextId = (): number => generator.next().value;
