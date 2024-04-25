const StaticLoop = (array, compspec, selectedIndex = 0) =>
  array.map(makeLoopItem(compspec, selectedIndex));
const makeLoopItem = (compspec, selectedIndex) => (value, index) => ({
  ...compspec,
  props: {
    ...compspec.props,
    key: index,
    value,
    selectedIndex,
  },
});

module.exports = {
  StaticLoop,
  makeLoopItem,
};
