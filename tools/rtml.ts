import { flatten, uniq, uniqBy, mapValues } from 'lodash';
import { genPage, findReferencesInProps, exportSection } from './genutil';

import { layoutToolInterpret } from './grid-tool-lib';
import { RtmlElement, StrictRtmlElement } from './types';
const { prefixes, mapTag } = require('./codegen-vocab');

const htmlTags = require('html-tags');

export const normalize = (el: RtmlElement): StrictRtmlElement => {
  if (!el) {
    throw new Error('Invalid input to normalize');
  }
  const defaults = {
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
    return { ...defaults, tag: 'PlainText', name: el, props: { text: el }, children: [] };
  }
  if (Array.isArray(el))
    return {
      ...defaults,
      name: '',
      tag: 'Fragment',
      children: el.map(normalize),
    };

  return {
    ...defaults,
    ...el,
    component: el.component ? true : false,
    imported: el.imported ? true : false,
    tag: el.tag || 'Fragment',
    name: el.name || '',
    props: el.props || {},
    children: (el.children || []).map(normalize),
  };
};

const isConstProp = (val: any) =>
  typeof val === 'object' ||
  (typeof val === 'string' &&
    (/^\$p\./.test(val) || /^\$s/.test(val) || /^\$GEN./.test(val) || /^\$L\./.test(val)))
    ? false
    : true;

const capitalize = (s: string): string => s.slice(0, 1).toUpperCase() + s.slice(1);

const renderPropValDyn = (val: any): any => {
  if (Array.isArray(val)) {
    return val.map(renderPropVal);
  } else if (typeof val === 'object') {
    return mapValues(val, renderPropVal);
  }
  return maybeJsonParse(val);
};

export const renderPropVal = (val: any): any => (isConstProp(val) ? val : renderPropValDyn(val));

const stateReplacer = (_match: any, name: string, value: string) =>
  `() => set${capitalize(name)}(${jsonify(renderPropVal(value))})`;

const ctxReplacer = (_match: any, name: string, value: string) =>
  `() => set${capitalize(name)}(${jsonify(renderPropVal(value))})`;

export const renderProps = (props: any) =>
  Object.keys(props)
    .map((k) => `${k}={${jsonify(renderPropVal(props[k]))}}`)
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
    .replace(/\$s\.(.*?)([^a-zA-Z0-9_$])/g, `"+ $1 +"$2`)

    // context, with quotes
    .replace(/\"\$c\.(.*?)\"/g, '$1')
    .replace(/\"\$c:(.*?):(.*?):.*\"/g, ctxReplacer)
    .replace(/\"\$c:(.*?):(.*?)\"/g, ctxReplacer)

    // context, without quotes
    .replace(/\$c\.(.*?)([^a-zA-Z0-9_$])/g, `"+ $1 +"$2`);
const renderChildren =
  (indent: string, path: string) =>
  (children: StrictRtmlElement[]): string =>
    children.map(_render(indent + '', path)).join('\n');

const renderReactFunction = (indent: string, path: string) => (t: StrictRtmlElement) =>
  `
	const ${t.name} = () => (<${t.tag} ${renderProps(t.props)}>
		${renderChildren(indent + '  ', path + '.' + (t.name || t.tag || '-'))(t.children)}
	</${t.tag}>);
	`;

const _render = (indent: string, path: string) => (t: StrictRtmlElement) => {
  if (t.component) {
    if (!t.name) {
      throw new Error('Name required for components');
    }
    return `${indent}<${t.name}/>`;
  }
  return t.children.length
    ? `${indent}<${t.tag} ${renderProps(t.props)}>
${renderChildren(indent + '  ', path + '.' + (t.name || t.tag || '-'))(t.children)}
${indent}</${t.tag}>`
    : `${indent}<${t.tag} ${renderProps(t.props)}/> `;
};

const postamble = `
  );
}
`;

const isMaterial = (name: string) => name.startsWith('$M.') || prefixes[name] === '$M';
const isMaterialIcon = (name: string) => name.startsWith('$I.') || prefixes[name] === '$I';
const isLocalLib = (name: string) => name.startsWith('$L.') || prefixes[name] === '$L';

const hasImportPath = (el: StrictRtmlElement) => el?.importPath;

export const getImportPath = (el: StrictRtmlElement) => {
  const compname = el.tag; //`./${el.name || el.tag}.rtml`
  if (hasImportPath(el)) {
    const parts = el.importPath?.split('#');
    const [file, func] = (parts && parts.length > 1 && parts) || [null, null];
    return { name: compname, path: file || el.importPath, func };
  }
  if (isMaterial(compname)) {
    const name = compname.replace('$M.', '');
    return {
      name,
      path: `@mui/material/${name}`,
    };
  }
  if (isMaterialIcon(compname)) {
    const name = compname.replace('$I.', '');
    return {
      name,
      path: `@mui/icons-material/${name}`,
    };
  }
  if (isLocalLib(compname)) {
    const name = compname.replace('$L.', '');
    return {
      name,
      path: `~/components/lib/${name}`,
    };
  }

  return {
    name: compname,
    path: `./${compname}.rtml`,
  };
};

const importExcludeList = [...htmlTags, 'Fragment', 'PlainText'];

export const renderImportBlock = (root: StrictRtmlElement): string => {
  const importCompList = listImports(root);
  //const importlist = importCompList.filter((c: StrictRtmlElement) =>
  //  (c.name !== root.name))
  const imports = importCompList
    .filter((comp: any) => !comp.tag.startsWith('$p'))
    .filter((comp: any) => !importExcludeList.includes(comp.tag))
    .map(getImportPath)
    .map(({ name, path, func }) =>
      func ? `import {${func} as ${name}} from "${path}"` : `import ${name} from "${path}"`,
    );
  const importBlock = uniq(imports).join('\n');
  return importBlock;
};

type StateSpec = { name: string; defaultValue: any };
type ContextSpec = { name: string; defaultValue: any };

const maybeJsonParse = (val: string): any => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
};

export const listStates = (root: StrictRtmlElement): any[] => {
  const props = root.props;
  const stateList = Object.keys(props)
    .filter((key) => /^\$s:/.test(props[key]))
    .map((key, i) => {
      let [_, name, __, _defaultValue] = props[key].split(':');
      const defaultValue = maybeJsonParse(_defaultValue);
      return { name, defaultValue };
    });
  return stateList.concat(flatten(root.children.map(listStates)));
};

// List contexts being used in this file
// Context setting directive looks like this:
// $c:<ctx name>:<field name>:value:default
// Default part is optional
export const listContexts = (root: StrictRtmlElement): any[] => {
  const props = root.props;
  const stateList = Object.keys(props)
    .filter((key) => /^\$c:/.test(props[key]))
    .map((key, i) => {
      let [_, name, __, _defaultValue] = props[key].split(':');
      const defaultValue = maybeJsonParse(_defaultValue);
      return { name, defaultValue };
    });
  return stateList.concat(flatten(root.children.map(listContexts)));
};

export const renderContextsBlock = (root: StrictRtmlElement): string => {
  const compareName = ({ name }: ContextSpec) => name;
  const stateList = uniqBy(flatten(listContexts(root)), compareName);
  return stateList
    .map(
      ({ name, defaultValue }) =>
        `  const [${name}, set${capitalize(name)}] = useGlobalStateCtx("${name}", ${jsonify(
          renderPropVal(defaultValue),
        )}); `,
    )

    .join('\n');
};

export const renderStatesBlock = (root: StrictRtmlElement): string => {
  const compareName = ({ name }: StateSpec) => name;
  const stateList = uniqBy(flatten(listStates(root)), compareName);
  return stateList
    .map(
      ({ name, defaultValue }) =>
        `  const [${name}, set${capitalize(name)}] = React.useState(${jsonify(
          renderPropVal(defaultValue),
        )})`,
    )
    .join('\n');
};

export const render = async (root: RtmlElement, outfn: string) => {
  const normalized = normalize(root);
  const useStatesBlock = renderStatesBlock(normalized).trim();
  const useContextsBlock = renderContextsBlock(normalized).trim();
  const importsBlock = renderImportBlock(normalized);
  const jsxBlock = _render('    ', '')(normalized);
  const jsxcode = await genPage(
    {
      name: root.name || root.tag,
      importsBlock,
      useStatesBlock,
      useContextsBlock,
      jsxBlock,
    },
    outfn,
  );

  // const jsxcode = preamblePage(root.name || root.tag, useStatesBlock, useContextsBlock, importsBlock) +
  //   jsxBlock +
  //   postamble +
  //   exportSection(root.name || root.tag)
  //   ;
  return jsxcode;
};

export const listImports = (compdef_: RtmlElement): StrictRtmlElement[] => {
  const compdef = normalize(compdef_);
  const importList = [compdef]; // (compdef.imported || compdef.component) ? [compdef] : [];

  // Find references to other generated components in props
  const referencedList = findReferencesInProps(compdef);

  const childList = compdef.children.map(listImports);

  const list = flatten([...importList, ...childList, ...referencedList]);
  return list;
};

export const interpretLayout = (spec: RtmlElement): StrictRtmlElement => {
  if (!spec.layout) {
    return normalize(spec);
  }
  const layout: StrictRtmlElement = layoutToolInterpret(spec.layout);
  // console.log("Layout obj", JSON.stringify(layout, null, 1))
  // Validate components
  if (!spec.components) {
    throw new Error('components field is required when layout is specified');
  }
  const componentDict: any = mapValues(spec.components, interpretLayout);

  // Insert components into the grid object
  const lookup = (name: string) => componentDict[name];

  const mapNode = (node: StrictRtmlElement): StrictRtmlElement => {
    const mappedNode = lookup(node.tag);
    //console.log(node.tag, "->", mappedNode)
    if (mappedNode) {
      return mappedNode;
    }
    const mappedChildren = (node.children && node.children.map(mapNode)) || [];
    return normalize({ ...node, children: mappedChildren });
  };
  return mapNode(layout);
};

export const jsonify = (x: any) => JSON.stringify(x, null, 2);
