'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
exports.layoutToolInterpret = exports.grid = void 0;
var lodash_1 = require('lodash');
/**
 * This function takes an easy-to-read and easy-to-write multi-line
 * string and interprets as a layout grid specification and returns a
 * tree object representing a MUI layout.
 *
 * Example specification:
 *
 *     Logo:2 > TitleArea:8 > RightMenu:2
 *     LeftMenu:4 > MainArea:8
 *     Footer:12
 *
 * This layout has three rows
 * The first one has three elements, Logo, TitleArea, RightMenu.
 * Logo uses two "xs" columns, TitleArea uses 8 and RightMenu uses 2.
 *
 * The second row has two elements, LeftMenu with 4 columns and
 * MainArea with 8.
 *
 * The third row has a single column with 12 cols.
 *
 * How to use:
 *
 *   import { grid } from "./grid-tool-lib"
 *   import { render} from "../rtml";
 *   const layoutstr = `...` // specification
 *   const layout = grid(layoutstr)
 *   const jsx = render(grid.toObject())
 *   // now jsx variable has the code required for this layout.
 *   // Write to a file or console, whatever.
 */
var grid = function (_spec) {
  var spec = joinRows(_spec.split(/[,\n]/).filter(filterOutComments).map(gRow));
  var setProps = function (props) {
    spec = __assign(__assign({}, spec), { props: __assign(__assign({}, spec.props), props) });
    return setProps;
  };
  // Convert to object for codegen
  setProps.toObject = function () {
    return spec;
  };
  // This is a little tricky - returning the setProps allows
  // chaining - you can keep setting properties, and you keep
  // getting a new grid object
  return setProps;
};
exports.grid = grid;
// Private code
var trim = function (s) {
  return s.trim();
};
var makeGridItem = function (_a) {
  var name = _a[0],
    width = _a[1];
  return {
    tag: 'Grid',
    props: { xs: +width, item: true },
    children: [{ tag: name }],
  };
};
var makeItem = function (itemspec) {
  return makeGridItem(itemspec.split(':'));
};
var gRow = function (str) {
  return str.split(/[>]/).map(trim).map(makeItem);
};
var joinRows = function (rows) {
  return {
    tag: 'Grid',
    props: {
      container: true,
    },
    children: (0, lodash_1.flatten)(rows),
  };
};
var filterOutComments = function (s) {
  return !/\s*\#.*$/.test(s);
};
var layoutToolInterpret = function (specstr) {
  var spec = (0, exports.grid)(specstr).toObject();
  spec.name = 'Root';
  return spec;
};
exports.layoutToolInterpret = layoutToolInterpret;
