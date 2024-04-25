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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
exports.__esModule = true;
exports.jsonify =
  exports.interpretLayout =
  exports.listImports =
  exports.render =
  exports.renderStatesBlock =
  exports.renderContextsBlock =
  exports.listContexts =
  exports.listStates =
  exports.renderImportBlock =
  exports.getImportPath =
  exports.renderProps =
  exports.renderPropVal =
  exports.normalize =
    void 0;
var lodash_1 = require('lodash');
var genutil_1 = require('./genutil');
var grid_tool_lib_1 = require('./grid-tool-lib');
var _a = require('./codegen-vocab'),
  prefixes = _a.prefixes,
  mapTag = _a.mapTag;
var htmlTags = require('html-tags');
var normalize = function (el) {
  if (!el) {
    throw new Error('Invalid input to normalize');
  }
  var defaults = {
    children: [],
    props: {},
    imported: false,
    importPath: null,
    component: false,
  };
  // console.log("normalizing",el.name || el.tag)
  if (typeof el == 'string') {
    // const text = (el as string).replace("$p.", "props.")
    // const text = renderPropVal(el)
    return __assign(__assign({}, defaults), {
      tag: 'PlainText',
      name: el,
      props: { text: el },
      children: [],
    });
  }
  if (Array.isArray(el))
    return __assign(__assign({}, defaults), {
      name: '',
      tag: 'Fragment',
      children: el.map(exports.normalize),
    });
  return __assign(__assign(__assign({}, defaults), el), {
    component: el.component ? true : false,
    imported: el.imported ? true : false,
    tag: el.tag || 'Fragment',
    name: el.name || '',
    props: el.props || {},
    children: (el.children || []).map(exports.normalize),
  });
};
exports.normalize = normalize;
var isConstProp = function (val) {
  return typeof val === 'object' ||
    (typeof val === 'string' &&
      (/^\$p\./.test(val) || /^\$s/.test(val) || /^\$GEN./.test(val) || /^\$L\./.test(val)))
    ? false
    : true;
};
var capitalize = function (s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
};
var renderPropValDyn = function (val) {
  if (Array.isArray(val)) {
    return val.map(exports.renderPropVal);
  } else if (typeof val === 'object') {
    return (0, lodash_1.mapValues)(val, exports.renderPropVal);
  }
  return maybeJsonParse(val);
};
var renderPropVal = function (val) {
  return isConstProp(val) ? val : renderPropValDyn(val);
};
exports.renderPropVal = renderPropVal;
var stateReplacer = function (_match, name, value) {
  return '() => set'
    .concat(capitalize(name), '(')
    .concat((0, exports.jsonify)((0, exports.renderPropVal)(value)), ')');
};
var ctxReplacer = function (_match, name, value) {
  return '() => set'
    .concat(capitalize(name), '(')
    .concat((0, exports.jsonify)((0, exports.renderPropVal)(value)), ')');
};
var renderProps = function (props) {
  return (
    Object.keys(props)
      .map(function (k) {
        return ''
          .concat(k, '={')
          .concat((0, exports.jsonify)((0, exports.renderPropVal)(props[k])), '}');
      })
      .join(' ')
      // special token processing
      .replace(/\"\$GEN\.(.*?)\"/g, '$1')
      .replace(/\"\$p\.(.*?)\"/g, 'props.$1')
      // state with quotes
      .replace(/\"\$s\.(.*?)\"/g, '$1')
      .replace(/\"\$s:(.*?):(.*?):.*\"/g, stateReplacer)
      .replace(/\"\$s:(.*?):(.*?)\"/g, stateReplacer)
      // state, without quotes - this is a bit tricky. We terminate a JSON
      // string from prior text and continue after the state name. The state
      // name itself should not be quoted.
      .replace(/\$s\.(.*?)([^a-zA-Z0-9_$])/g, '"+ $1 +"$2')
      // context, with quotes
      .replace(/\"\$c\.(.*?)\"/g, '$1')
      .replace(/\"\$c:(.*?):(.*?):.*\"/g, ctxReplacer)
      .replace(/\"\$c:(.*?):(.*?)\"/g, ctxReplacer)
      // context, without quotes
      .replace(/\$c\.(.*?)([^a-zA-Z0-9_$])/g, '"+ $1 +"$2')
  );
};
exports.renderProps = renderProps;
var renderChildren = function (indent, path) {
  return function (children) {
    return children.map(_render(indent + '', path)).join('\n');
  };
};
var renderReactFunction = function (indent, path) {
  return function (t) {
    return '\n\tconst '
      .concat(t.name, ' = () => (<')
      .concat(t.tag, ' ')
      .concat((0, exports.renderProps)(t.props), '>\n\t\t')
      .concat(
        renderChildren(indent + '  ', path + '.' + (t.name || t.tag || '-'))(t.children),
        '\n\t</',
      )
      .concat(t.tag, '>);\n\t');
  };
};
var _render = function (indent, path) {
  return function (t) {
    if (t.component) {
      if (!t.name) {
        throw new Error('Name required for components');
      }
      return ''.concat(indent, '<').concat(t.name, '/>');
    }
    return t.children.length
      ? ''
          .concat(indent, '<')
          .concat(t.tag, ' ')
          .concat((0, exports.renderProps)(t.props), '>\n')
          .concat(
            renderChildren(indent + '  ', path + '.' + (t.name || t.tag || '-'))(t.children),
            '\n',
          )
          .concat(indent, '</')
          .concat(t.tag, '>')
      : ''
          .concat(indent, '<')
          .concat(t.tag, ' ')
          .concat((0, exports.renderProps)(t.props), '/> ');
  };
};
var postamble = '\n  );\n}\n';
var isMaterial = function (name) {
  return name.startsWith('$M.') || prefixes[name] === '$M';
};
var isMaterialIcon = function (name) {
  return name.startsWith('$I.') || prefixes[name] === '$I';
};
var isLocalLib = function (name) {
  return name.startsWith('$L.') || prefixes[name] === '$L';
};
var hasImportPath = function (el) {
  return el === null || el === void 0 ? void 0 : el.importPath;
};
var getImportPath = function (el) {
  var _a;
  var compname = el.tag; //`./${el.name || el.tag}.rtml`
  if (hasImportPath(el)) {
    var parts = (_a = el.importPath) === null || _a === void 0 ? void 0 : _a.split('#');
    var _b = (parts && parts.length > 1 && parts) || [null, null],
      file = _b[0],
      func = _b[1];
    return { name: compname, path: file || el.importPath, func: func };
  }
  if (isMaterial(compname)) {
    var name_1 = compname.replace('$M.', '');
    return {
      name: name_1,
      path: '@mui/material/'.concat(name_1),
    };
  }
  if (isMaterialIcon(compname)) {
    var name_2 = compname.replace('$I.', '');
    return {
      name: name_2,
      path: '@mui/icons-material/'.concat(name_2),
    };
  }
  if (isLocalLib(compname)) {
    var name_3 = compname.replace('$L.', '');
    return {
      name: name_3,
      path: '~/components/lib/'.concat(name_3),
    };
  }
  return {
    name: compname,
    path: './'.concat(compname, '.rtml'),
  };
};
exports.getImportPath = getImportPath;
var importExcludeList = __spreadArray(
  __spreadArray([], htmlTags, true),
  ['Fragment', 'PlainText'],
  false,
);
var renderImportBlock = function (root) {
  var importCompList = (0, exports.listImports)(root);
  //const importlist = importCompList.filter((c: StrictRtmlElement) =>
  //  (c.name !== root.name))
  var imports = importCompList
    .filter(function (comp) {
      return !comp.tag.startsWith('$p');
    })
    .filter(function (comp) {
      return !importExcludeList.includes(comp.tag);
    })
    .map(exports.getImportPath)
    .map(function (_a) {
      var name = _a.name,
        path = _a.path,
        func = _a.func;
      return func
        ? 'import {'.concat(func, ' as ').concat(name, '} from "').concat(path, '"')
        : 'import '.concat(name, ' from "').concat(path, '"');
    });
  var importBlock = (0, lodash_1.uniq)(imports).join('\n');
  return importBlock;
};
exports.renderImportBlock = renderImportBlock;
var maybeJsonParse = function (val) {
  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
};
var listStates = function (root) {
  var props = root.props;
  var stateList = Object.keys(props)
    .filter(function (key) {
      return /^\$s:/.test(props[key]);
    })
    .map(function (key, i) {
      var _a = props[key].split(':'),
        _ = _a[0],
        name = _a[1],
        __ = _a[2],
        _defaultValue = _a[3];
      var defaultValue = maybeJsonParse(_defaultValue);
      return { name: name, defaultValue: defaultValue };
    });
  return stateList.concat((0, lodash_1.flatten)(root.children.map(exports.listStates)));
};
exports.listStates = listStates;
// List contexts being used in this file
// Context setting directive looks like this:
// $c:<ctx name>:<field name>:value:default
// Default part is optional
var listContexts = function (root) {
  var props = root.props;
  var stateList = Object.keys(props)
    .filter(function (key) {
      return /^\$c:/.test(props[key]);
    })
    .map(function (key, i) {
      var _a = props[key].split(':'),
        _ = _a[0],
        name = _a[1],
        __ = _a[2],
        _defaultValue = _a[3];
      var defaultValue = maybeJsonParse(_defaultValue);
      return { name: name, defaultValue: defaultValue };
    });
  return stateList.concat((0, lodash_1.flatten)(root.children.map(exports.listContexts)));
};
exports.listContexts = listContexts;
var renderContextsBlock = function (root) {
  var compareName = function (_a) {
    var name = _a.name;
    return name;
  };
  var stateList = (0, lodash_1.uniqBy)(
    (0, lodash_1.flatten)((0, exports.listContexts)(root)),
    compareName,
  );
  return stateList
    .map(function (_a) {
      var name = _a.name,
        defaultValue = _a.defaultValue;
      return '  const ['
        .concat(name, ', set')
        .concat(capitalize(name), '] = useGlobalStateCtx("')
        .concat(name, '", ')
        .concat((0, exports.jsonify)((0, exports.renderPropVal)(defaultValue)), '); ');
    })
    .join('\n');
};
exports.renderContextsBlock = renderContextsBlock;
var renderStatesBlock = function (root) {
  var compareName = function (_a) {
    var name = _a.name;
    return name;
  };
  var stateList = (0, lodash_1.uniqBy)(
    (0, lodash_1.flatten)((0, exports.listStates)(root)),
    compareName,
  );
  return stateList
    .map(function (_a) {
      var name = _a.name,
        defaultValue = _a.defaultValue;
      return '  const ['
        .concat(name, ', set')
        .concat(capitalize(name), '] = React.useState(')
        .concat((0, exports.jsonify)((0, exports.renderPropVal)(defaultValue)), ')');
    })
    .join('\n');
};
exports.renderStatesBlock = renderStatesBlock;
var render = function (root, outfn) {
  return __awaiter(void 0, void 0, void 0, function () {
    var normalized, useStatesBlock, useContextsBlock, importsBlock, jsxBlock, jsxcode;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          normalized = (0, exports.normalize)(root);
          useStatesBlock = (0, exports.renderStatesBlock)(normalized).trim();
          useContextsBlock = (0, exports.renderContextsBlock)(normalized).trim();
          importsBlock = (0, exports.renderImportBlock)(normalized);
          jsxBlock = _render('    ', '')(normalized);
          return [
            4 /*yield*/,
            (0, genutil_1.genPage)(
              {
                name: root.name || root.tag,
                importsBlock: importsBlock,
                useStatesBlock: useStatesBlock,
                useContextsBlock: useContextsBlock,
                jsxBlock: jsxBlock,
              },
              outfn,
            ),
          ];
        case 1:
          jsxcode = _a.sent();
          // const jsxcode = preamblePage(root.name || root.tag, useStatesBlock, useContextsBlock, importsBlock) +
          //   jsxBlock +
          //   postamble +
          //   exportSection(root.name || root.tag)
          //   ;
          return [2 /*return*/, jsxcode];
      }
    });
  });
};
exports.render = render;
var listImports = function (compdef_) {
  var compdef = (0, exports.normalize)(compdef_);
  var importList = [compdef]; // (compdef.imported || compdef.component) ? [compdef] : [];
  // Find references to other generated components in props
  var referencedList = (0, genutil_1.findReferencesInProps)(compdef);
  var childList = compdef.children.map(exports.listImports);
  var list = (0, lodash_1.flatten)(
    __spreadArray(
      __spreadArray(__spreadArray([], importList, true), childList, true),
      referencedList,
      true,
    ),
  );
  return list;
};
exports.listImports = listImports;
var interpretLayout = function (spec) {
  if (!spec.layout) {
    return (0, exports.normalize)(spec);
  }
  var layout = (0, grid_tool_lib_1.layoutToolInterpret)(spec.layout);
  // console.log("Layout obj", JSON.stringify(layout, null, 1))
  // Validate components
  if (!spec.components) {
    throw new Error('components field is required when layout is specified');
  }
  var componentDict = (0, lodash_1.mapValues)(spec.components, exports.interpretLayout);
  // Insert components into the grid object
  var lookup = function (name) {
    return componentDict[name];
  };
  var mapNode = function (node) {
    var mappedNode = lookup(node.tag);
    //console.log(node.tag, "->", mappedNode)
    if (mappedNode) {
      return mappedNode;
    }
    var mappedChildren = (node.children && node.children.map(mapNode)) || [];
    return (0, exports.normalize)(__assign(__assign({}, node), { children: mappedChildren }));
  };
  return mapNode(layout);
};
exports.interpretLayout = interpretLayout;
var jsonify = function (x) {
  return JSON.stringify(x, null, 2);
};
exports.jsonify = jsonify;
