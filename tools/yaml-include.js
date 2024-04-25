const YAML = require('yaml');
const { keys, omit } = require('lodash');
const { preadFile } = require('./fsutil');

const parse = (str) => YAML.parse(str);

const mapValuesAsync = async (obj, asyncFn) => {
  const keys = Object.keys(obj);
  const promises = keys.map((k) => {
    return asyncFn(obj[k]).then((newValue) => {
      return { key: k, value: newValue };
    });
  });
  return Promise.all(promises).then((values) =>
    values.reduce((acc, val) => ({ ...acc, [val.key]: val.value }), {}),
  );
};

// Calculate included path for included yamls. If the included name
// starts with a ".", then take the dir name from the srcFile, and
// then concat the file name.
const includedFileToPath = (srcFile, includedFile) => {
  if (/^\.\/.*/.test(includedFile)) {
    const parts = srcFile.split('/');
    parts.pop(); // remove file name
    return parts.join('/') + '/' + includedFile.replace('./', '');
  }
  if (/^\.\.\/.*/.test(includedFile)) {
    const parts = srcFile.split('/');
    parts.pop(); // remove file name
    parts.pop(); // remove last dir
    return parts.join('/') + '/' + includedFile.replace('../', '');
  }

  return includedFile.replace('~', '.');
};

const processValue = (srcFile) => async (value) => {
  if (!value) {
    return value;
  }
  if (typeof value === 'string') {
    if (/^file[:@]/.test(value)) {
      const includedFile = value.split(/^file[:@]/)[1];
      const includePath = includedFileToPath(srcFile, includedFile);
      const includedContent = await preadFile(includePath);
      /* If included file is not yaml, interpret it as text */
      if (!/.yml|.yaml$/.test(includePath)) {
        return includedContent;
      }
      return yamlWithInclude(includedFile)(includedContent);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map(processValue(srcFile)));
  }
  if (typeof value === 'object') {
    return mapValuesAsync(value, processValue(srcFile));
  }
  return value;
};

const yamlWithInclude = (srcFile) => async (content) => {
  const parsed = parse(content);
  const extended = await maybeExtendYaml(srcFile, parsed);
  const mapped = await mapValuesAsync(extended, processValue(srcFile));
  return mapped;
};

// If a field named "extends" is defined, then load the extension
async function maybeExtendYaml(srcFile, oYaml) {
  if (!(oYaml && oYaml.extends)) {
    return oYaml;
  }
  const extensionPath = includedFileToPath(srcFile, oYaml.extends);
  const extendYamlStr = await preadFile(extensionPath);
  const oExtendYaml = await yamlWithInclude(extensionPath)(extendYamlStr);
  const extended = {
    ...omit(oExtendYaml, keys(oYaml)),
    ...oYaml,
  };
  return extended;
}

module.exports = { yamlWithInclude, processValue };
