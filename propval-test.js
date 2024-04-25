const rtml = require('./tools/rtml');

const inputs = [
  { x: 1 },
  { x: 'constant string', Comp1: '$GEN.FarmerEditor', Comp2: '$GEN.FarmerEditor2' },
  { x: true },
  { x: ['a', 'b', '$p.x', 'blah'], onClick: '$s:foo:bar:0' },
  { x: { x: { y: '$p.x', z: 2 } } },
  { x: { x: { y: '$s.x', z: 2 } } },
];

inputs.forEach((x) => console.log(rtml.renderProps(x)));
