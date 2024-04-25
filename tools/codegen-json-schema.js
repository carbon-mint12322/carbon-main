const flow = require('lodash/flow');
const last = require('lodash/last');
const once = require('lodash/once');
const startCase = require('lodash/startCase');
const YAML = require('yaml');
const fg = require('fast-glob');
const R = require('ramda');
const path = require('path');
const { genWithTemplate, genWithTemplateNoOverwrite } = require('./genutil');
const { yamlWithInclude } = require('./yaml-include');
const Ajv = require('ajv');

const { preadFile, pmkdir, pwriteFile } = require('./fsutil');
const { cleanupDefinitions } = require('./cleanup-defs');

const dotenv = require('dotenv');
const { uniqBy, identity } = require('lodash');
const { fn } = require('moment');

dotenv.config();
const defsFile = './specs/jsonschemas/src/common/definitions.yaml';

const capitalize = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);

const insertId = (modelName) => (obj) => ({
  type: 'object',
  ...obj.jsonschema,
  $id: obj.schemaId || `/farmbook/jsonschemas/${modelName}`,
  schemaId: obj.schemaId || `/farmbook/jsonschemas/${modelName}`,
});

const srcFile2ModelName = (srcFile) => {
  // eslint-disable-next-line
  const srcFileParts = srcFile.split(/[\.\/]/);
  return srcFileParts[srcFileParts.length - 2];
};

const processSrc = async (srcFile) => {
  const yamlText = await preadFile(srcFile);
  const obj = await yamlWithInclude(srcFile)(yamlText);
  // console.log("parsed from ", srcFile, "is: ", obj)
  const modelName = srcFile2ModelName(srcFile);

  const postProcessor = R.compose(insertId(modelName), R.identity);
  return { [modelName]: postProcessor(obj) };
};

const loadEntityValidationLifecycle = once(async () => {
  const srcFile = "specs/jsonschemas/src/domain/entityValidationLifecycle.yaml";
  const yamlText = await preadFile(srcFile);
  return yamlWithInclude(srcFile)(yamlText);
});

const loadPageDefSchema = once(async function loadPageDefSchema() {
  const srcFile = "tools/entity-ui-schema.yaml";
  const yamlText = await preadFile(srcFile);
  return yamlWithInclude(srcFile)(yamlText);
});

async function validatePageDefs(schemaObj, srcFile) {
  if (!schemaObj.uiHints) { return }
  const pageDefSchema = await loadPageDefSchema();
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(pageDefSchema);
  // if (schemaObj.uiHints?.createPage) {
  //   // console.log({ createPage: schemaObj.uiHints?.createPage })
  //   // console.log({ srcFile, uiOrder: schemaObj.uiHints?.form.uiSchema['ui:order'] })
  // }
  const valid = validate(schemaObj.uiHints);
  if (!valid) {
    console.log(validate.errors, srcFile);
    throw new Error('Page def validation failed');
  }
}

const generateOne = (_definitions) => async (srcFile) => {
  const yamlText = await preadFile(srcFile);
  const _schemaObj = await yamlWithInclude(srcFile)(yamlText);
  const modelName = srcFile2ModelName(srcFile);
  if (_schemaObj.validationLifecycle && !_schemaObj.lifecycle) { // inject validation lifecycle
    const entityValidationLifecycle = await loadEntityValidationLifecycle();
    _schemaObj.lifecycle = entityValidationLifecycle.lifecycle;
  }
  // console.log({ srcFile, _schemaObj, _definitions });
  const cleanedupSchema = cleanupDefinitions({
    ..._schemaObj.jsonschema,
    definitions: _definitions,
  });
  const schemaObj = {
    ..._schemaObj,
    jsonschema: cleanedupSchema,
  };
  const definitions = cleanedupSchema.definitions;
  // console.log({ srcFile, schema: _schemaObj, definitions });

  await validatePageDefs(schemaObj, srcFile);

  await pmkdir(path.join(apiGenRoot, modelName));

  const generators =
    srcFile === defsFile
      ? [schemaGen] // generate only .json file for definitions
      : [
        schemaGen,
        formUiSchemaGen,
        excelGen,
        reactmlFormGen,
        // reactmlRoViewGen,
        // reactmlTableGen,
        // reactmlMasterDetailGen,
        listTitleBarGen,
        listImportsGen,
        listComponentGen,
        listPageGen,
        mobileListComponentGen,

        createTitleBarGen,
        createComponentGen,
        createPageGen,

        detailTitleBarGen,
        detailImportsGen,
        detailComponentGen,
        detailPageGen,
        mobileDetailComponentGen,

        eventListComponentGen,
        eventListPageGen,

        eventCreateTitlebarGen,
        eventCreateComponentGen,
        eventCreatePageGen,

        eventEditTitlebarGen,
        eventEditComponentGen,
        eventEditPageGen,

        titlebarsGen,

        apiCreateGen,
        apiGetGen,
        apiListGen,
        apiUpdateGen,
        apiDeleteGen,
        apiModelRootGen, // model/model-index
        apiModelInstanceRootGen, // model/instance-index
        // apiModelIndexGen, // model/index.ts
        // apiModelInstanceIndexGen, //model/[id]/index.ts
        workflowGen,
      ];
  const schemaId = schemaObj.schemaId || `/farmbook/${modelName}`;
  if (!schemaObj.jsonschema) {
    return;
  }
  if (!schemaObj.jsonschema.$id) {
    schemaObj.jsonschema.$id = schemaId;
  }

  const schemaObj2 = addRenderFunctionsOverview(addRenderFunctionsListComponent(schemaObj));
  await Promise.all(
    generators.map((generate) => generate(modelName, schemaObj2, definitions, schemaId)),
  );
  return { modelName, schemaObj: schemaObj2, schemaId };
};

// Add default render functions to colDefs in overview tab
function addRenderFunctionsOverview(schemaObj) {
  if (!schemaObj.uiHints?.detailPage?.overviewFields) return schemaObj;
  const mappedColDefs = schemaObj.uiHints.detailPage.overviewFields.map(maybeAddColDefRender) || [];
  const schemaObj2 = {
    ...schemaObj,
    uiHints: {
      ...schemaObj.uiHints || {},
      detailPage: {
        ...schemaObj.uiHints.detailPage,
        overviewFields: mappedColDefs
      }
    }
  }
  return schemaObj2;
}

// Add default render functions to colDefs in listPage
function addRenderFunctionsListComponent(schemaObj) {
  if (!schemaObj.uiHints?.listPage) return schemaObj;
  const mappedColDefs = schemaObj.uiHints.listPage.colDefs?.map(maybeAddColDefRender) || [];
  const schemaObj2 = {
    ...schemaObj,
    uiHints: {
      ...schemaObj.uiHints || {},
      listPage: {
        ...schemaObj.uiHints.listPage,
        colDefs: mappedColDefs
      }
    }
  }
  return schemaObj2;

}
function maybeAddColDefRender(colDef) {
  if (colDef.valueGetter || colDef.renderCell) {
    return colDef;
  }
  return {
    ...colDef,
    renderCell: `render${capitalize(colDef.field)}`,
  };
}

const arr2obj = (arr) => arr.reduce((acc, el) => ({ ...acc, ...el }), {});

const uiSchemaLens = R.lensPath(['uiHints', 'form', 'uiSchema']);

const reactmlFormText = (modelName, modelspec, definitions) => {
  const { jsonschema, uiHints } = modelspec;
  const uiSchema = R.view(uiSchemaLens, modelspec) || {};
  const reactmlStruct = {
    name: `${modelName}Editor`,
    tag: 'ReactJsonSchemaForm',
    importPath: '~/components/lib/ReactJsonSchemaForm',
    props: {
      modelName,
      schema: {
        ...jsonschema,
        definitions,
      },
      formData: '$p.formData',
      onSubmit: '$p.onSubmit',
      onSuccess: '$p.onSuccess',
      onChange: '$p.onChange',
      onError: '$p.onError',
      onSettled: '$p.onSettled',
      onSubmitAttempt: '$p.onSubmitAttempt',
      onFormError: '$p.onFormError',
      mainBtnLabel: '$p.mainBtnLabel',
      onCancelBtnClick: '$p.onCancelBtnClick',
      readonly: '$p.readonly',
      uiSchema,
    },
  };
  return `# Generated code\n${YAML.stringify(reactmlStruct)}`;
};

const reactmlRoViewText = (modelName, modelspec, definitions) => {
  const { jsonschema /*uiHints*/ } = modelspec;
  const uiSchema = R.view(uiSchemaLens, modelspec) || {};
  const reactmlStruct = {
    name: `${modelName}RoView`,
    tag: 'ReadOnlyRjsf',
    // Use read-only version of RJSF (customized to show uneditable text)
    importPath: '~/components/lib/ReadOnlyRjsf',
    props: {
      modelName,
      schema: {
        ...jsonschema,
        definitions,
      },
      uiSchema,
      formData: '$p.formData',
    },
  };
  return `# Generated code\n${YAML.stringify(reactmlStruct)}`;
};

const uiSchemaText = (modelName, modelspec, definitions) => {
  const uiSchema = R.view(uiSchemaLens, modelspec) || {};
  return JSON.stringify(uiSchema, null, 2);
};

const tableDefLens = R.lensPath(['uiHints', 'table']);

const reactmlTableText = (modelName, modelspec, definitions) => {
  const { jsonschema, uiHints } = modelspec;
  const tableProps = R.view(tableDefLens, modelspec) || { dataGridOptions: {} };
  const { dataGridOptions, ...otherProps } = tableProps;
  // Projection specifies which fields to fetch from mongo
  const projection = (dataGridOptions.columns || [])
    .map((def) => def.field)
    .reduce((acc, name) => ({ ...acc, [name]: 1 }), {});
  const queryConfig = {
    dataSource: `/api/${modelName}`, // List end point
    projection,
  };
  const reactmlStruct = {
    name: `${modelName}DataGrid`,
    tag: 'DataGrid',
    importPath: '~/components/lib/DataGrid',
    props: {
      modelName,
      dataGridOptions,
      data: '$p.data',
      queryConfig,
      ...otherProps,
    },
  };
  return `# Generated code\n${YAML.stringify(reactmlStruct)}`;
};
const main = async () => {
  console.log('Processing schema files...');
  const _srcFiles = (await fg('./specs/jsonschemas/src/**/*.yaml'))
    .filter((fn) => !/\/ui/.test(fn))
    .filter((fn) => !/\/common/.test(fn));
  const srcFiles = [..._srcFiles, defsFile];
  const defsText = await preadFile(defsFile);
  const _definitions = (await yamlWithInclude(defsFile)(defsText)).jsonschema;

  // const schemaDefs = [];
  // for (let srcFile of srcFiles) {
  //   const schemaDef = await generateOne(_definitions)(srcFile);
  //   schemaDefs.push(schemaDef);
  //   console.log(`${srcFile} done`);
  // }
  const schemaDefs = await Promise.all(srcFiles.map(generateOne(_definitions)));
  await genSchemaDirectory(schemaDefs);
  await genTemplatedViews(schemaDefs);
  await genModelTable(schemaDefs);
  return 'done';
};

module.exports = {
  main,
  generateOne,
};

const schemaGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/jsonschemas/${modelName}.json`;
  // console.log(`[JSON] ${fn}`);
  const schema = { ...schemaObj.jsonschema, definitions };
  await pwriteFile(fn, JSON.stringify(schema, null, 1));
  return fn;
};

const excelGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/excel/${modelName}.json`;
  const schema = { ...schemaObj.uiHints?.excel };
  if (Object.keys(schema).length > 0)
    await pwriteFile(fn, JSON.stringify(schema, null, 1));
  return fn;
};

const reactmlTableGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/data-views/${modelName}/${modelName}DataGrid.rtml.yaml`;
  // console.log(`[ReactML] ${fn}`)
  const code = reactmlTableText(modelName, schemaObj, definitions);
  await pwriteFile(fn, code);
  return fn;
};

const reactmlFormGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/data-views/${modelName}/${modelName}Editor.rtml.jsx`;
  const template = 'tools/templates/forms/editor.tsx.mustache';
  const generationCtx = { modelName, schemaId };
  return await genWithTemplate(template, fn, generationCtx);
};

const formUiSchemaGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/ui-schemas/${modelName}-ui-schema.json`;
  const code = uiSchemaText(modelName, schemaObj, definitions);
  await pwriteFile(fn, code);
  return fn;
};

// Read-only (display view) for a schema
const reactmlRoViewGen = async (modelName, schemaObj, definitions, schemaId) => {
  const fn = `./gen/data-views/${modelName}/${modelName}ReadOnlyView.rtml.yaml`;
  const code = reactmlRoViewText(modelName, schemaObj, definitions);
  await pwriteFile(fn, code);
  return fn;
};

const reactmlMasterDetailGen = async (modelName, schemaObj, definitions, schemaId) => {
  // const template = `tools/templates/data-views/MasterDetail.rtml.jsx.mustache`;
  // const fn = `./gen/data-views/${modelName}/MasterDetail.rtml.jsx`;
  // const generationCtx = { modelName, schemaId };
  // return await genWithTemplate(template, fn, generationCtx);

  //console.log(`[ReactML] ${fn}`)
  const rtmlSpec = {
    tag: 'MasterDetail',
    name: 'MasterDetailComboView',
    importPath: '~/components/Main-Drawer-Layout',
    props: {
      MainContent: `$GEN.${modelName}DataGrid`,
      DrawerContent: `$GEN.${modelName}Editor`,
      data: '$p.data',
      open: '$p.open',
    },
  };
  await pwriteFile(fn, YAML.stringify(rtmlSpec));
  return fn;
};

const apiGenRoot = './gen/pages/api';

// The files in the gen-pages are generated, but meant to be
// copied into /pages root and manually maintained. These are oneliners
// that point to the apiGenRoot code (to start with).
//
// These files will be ignored by git (via the .gitignore file).
//
// You can copy these files into the pages/api, in their entirety, like
// this (to avoid overwriting):
// cp -rp gen-pages/api/* pages/api
const apiGenRoot2 = './gen-pages/api';

const apiWhiteList = [
  'agent',
  'ahdashboard',
  'certificationbody',
  'collective',
  'cow',
  'crop',
  'crop-qr',
  'croppingsystem',
  'customer',
  'event',
  'farmer',
  'processor',
  'field',
  'goat',
  'landparcel',
  'mastercrop',
  'notification',
  'plot',
  'pop',
  'poultrypop',
  'processingsystem',
  'product',
  'productBatch',
  'productionsystem',
  'report',
  'reports',
  'sheep',
  'technician',
  'tenant',
  'user',
  'wfinstance',
];
const genApiWithTemplate = async (context) => {
  const { modelName, schemaId, operation } = context;
  if (!apiWhiteList.includes(modelName)) {
    return;
  }
  const fn = `${apiGenRoot}/${modelName}/${operation}.ts`;
  // console.log(`[API] ${fn}`)
  const template = `tools/templates/api/${operation}.ts.mustache`;
  const generationCtx = { modelName, schemaId };
  return await genWithTemplate(template, fn, generationCtx);
};

async function listPageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/list-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/list/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      makeR: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions,
      listPageOptionsJson,
    },
  );
}

//context has:  modelName, schemaObj, definitions, schemaId
async function listImportsGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);

  const renderColDefs = listPageOptions.colDefs.filter((colDef) =>
    colDef.renderCell ? true : false
  );
  const valueGetterColDefs = listPageOptions.colDefs.filter((colDef) =>
    colDef.valueGetter ? true : false
  );

  const renderFunctions = uniqBy(listPageOptions.colDefs.map((colDef) =>
    (colDef.renderCell || colDef.field).replace(/[\.\s\-]/, "_")
  ).filter(isDefined), identity);
  const valueGetterFunctions = uniqBy(valueGetterColDefs.map((colDef) =>
    colDef.valueGetter
  ).filter(isDefined), identity);

  const newColDefs = await Promise.all(
    listPageOptions.colDefs
      .map(genRenderCell(modelName, schemaId, schemaObj))
  );

  await Promise.all(
    valueGetterColDefs
      .map(genValueGetter(modelName, schemaId))
  );

  return genWithTemplate(
    'tools/templates/page-components/list-lib-index.ts.mustache',
    `./gen/entitylib/${modelName}/list/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions: { ...listPageOptions, colDefs: newColDefs },
      listPageOptionsJson,
      renderFunctions,
      valueGetterFunctions,
    },
  );
}

// value getter (list view) function generation
function genValueGetter(modelName, schemaId) {
  return (colDef) => {
    const fnName = colDef.valueGetter;
    const fn = `./gen/entitylib/${modelName}/list/${fnName}.ts`;
    const template = `tools/templates/page-components/list-value-getter-function.ts.mustache`;
    const generationCtx = { modelName, schemaId, fnName, colDef };
    return genWithTemplate(template, fn, generationCtx);
  };
}

function getFormatterName(field, fieldType) {
  if (/[dD]ate/.test(field)) {
    return "dateFormatter";
  }
  if (/[nN]ame/.test(field)) {
    return "stringFormatter";
  }
  // console.log({ msg: "getFormatterName", field, fieldType })
  switch (fieldType) {
    case "date":
      return "dateFormatter";
    case "datetime":
      return "datetimeFormatter";
    case "string":
      return "stringFormatter";
    case "number":
      return "numberFormatter";
    default:
      return "identityFormatter";
  }
}

// cell render (list view) function generation
function genRenderCell(modelName, schemaId, schemaObj) {
  const schema = schemaObj.jsonschema;
  return async (colDef) => {
    const fnName = (colDef.renderCell || colDef.field).replace(/[\.\s\-]/, "_");
    const fn = `./gen/entitylib/${modelName}/list/${fnName}.tsx`;
    const template = `tools/templates/page-components/render-list-function.ts.mustache`;
    const fieldType = getFieldType(colDef.field, schema);
    const generationCtx = {
      modelName, schemaId, fnName, fieldVariableName: fnName, colDef, fieldType,
      formatter: getFormatterName(colDef.field, fieldType),
      isAction: colDef.field === "actions" || false,
    };
    await genWithTemplate(template, fn, generationCtx);
    return { ...colDef, renderCell: fnName }
  };
}

function genRenderOverviewField(modelName, schemaId, schemaObj) {
  const schema = schemaObj.jsonschema;
  return (colDef) => {
    const fnName = colDef.renderCell || colDef.field;
    const fn = `./gen/entitylib/${modelName}/detail/${fnName}.tsx`;
    const template = `tools/templates/page-components/render-function.ts.mustache`;
    const fieldType = getFieldType(colDef.field, schema);
    const generationCtx = {
      modelName, schemaId, fnName, fieldVariableName: fnName, colDef, fieldType,
      formatter: getFormatterName(colDef.field, fieldType)
    };
    return genWithTemplate(template, fn, generationCtx);
  };
}

//context has:  modelName, schemaObj, definitions, schemaId
async function mobileListComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/mobile/list-view.tsx.mustache',
    `gen/${modelName}/mobile/list.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions,
      listPageOptionsJson,
    },
  );
}

//context has:  modelName, schemaObj, definitions, schemaId
async function mobileDetailComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/mobile/detail-view.tsx.mustache',
    `gen/${modelName}/mobile/detail.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions,
      listPageOptionsJson,
    },
  );
}


// Titlebar related files
async function titlebarsGen(modelName, schemaObj, definitions, schemaId) {
  const pageList = [];
  if (schemaObj.uiHints?.listPage) {
    pageList.push("list");
  }
  if (schemaObj.uiHints?.detailPage) {
    pageList.push("detail");
  }
  if (schemaObj.uiHints?.createPage) {
    pageList.push("create");
  }
  if (schemaObj.uiHints?.eventCreatePage) {
    pageList.push("event-create");
  }
  if (schemaObj.uiHints?.eventEditPage) {
    pageList.push("event-edit");
  }
  // list of functions to generate - actually names of output files
  const functions = [
    "title",
    "subtitle",
    "main-btn-title",
    "sub-btn-title",
    "show-titlebar",
    "show-title",
    "show-subtitle",
    "show-main-btn",
    "show-sub-btn",
    "show-del-btn",
    "show-search",
  ];

  const defaults = {
    list: {
      "sub-btn-title": true,
      "show-titlebar": true,
      "show-title": true,
      "show-subtitle": true,
      "show-main-btn": true,
      "show-sub-btn": false,
      "show-del-btn": true,
      "show-search": true,
    },
    detail: {
      "sub-btn-title": true,
      "show-titlebar": true,
      "show-title": true,
      "show-subtitle": true,
      "show-main-btn": true,
      "show-sub-btn": false,
      "show-del-btn": false,
      "show-search": false,
    },
    create: {
      "sub-btn-title": true,
      "show-titlebar": true,
      "show-title": true,
      "show-subtitle": true,
      "show-main-btn": true,
      "show-sub-btn": false,
      "show-del-btn": false,
      "show-search": false,
    },
    "event-create": {
      "sub-btn-title": true,
      "show-titlebar": true,
      "show-title": true,
      "show-subtitle": true,
      "show-main-btn": true,
      "show-sub-btn": false,
      "show-del-btn": true,
      "show-search": false,
    },
    "event-edit": {
      "sub-btn-title": true,
      "show-titlebar": true,
      "show-title": true,
      "show-subtitle": true,
      "show-main-btn": true,
      "show-sub-btn": false,
      "show-del-btn": true,
      "show-search": false,
    },
  }

  function getPageOptions(pageType, schemaObj) {
    switch (pageType) {
      case "list":
        return schemaObj.uiHints.listPage;
      case "detail":
        return schemaObj.uiHints.detailPage;
      case "create":
        return schemaObj.uiHints.createPage;
      case "event-create":
        return schemaObj.uiHints.eventCreatePage;
      case "event-edit":
        return schemaObj.uiHints.eventEditPage;
    }
  }
  function fnToConfigFlag(fn) {
    switch (fn) {
      case "subtitle":
        return "showTitlebarSubTitle";
      case "show-titlebar":
        return "showTitlebar";
      case "show-title":
        return "showTitlebarTitle";
      case "show-subtitle":
        return "showTitlebarSubTitle";
      case "show-main-btn":
        return "showTitlebarMainBtn";
      case "show-sub-btn":
        return "showTitlebarSubBtn";
      case "show-del-btn":
        return "showDelBtn";
      case "show-search":
        return "showTitlebarSearch";
    }
  }

  for (let pageType of pageList) {
    for (let fn of functions) {
      const pageOptions = getPageOptions(pageType, schemaObj);
      const configFieldName = fnToConfigFlag(fn)
      const configValue = pageOptions.titleBar[configFieldName];
      // console.log({ modelName, pageType, fn, configFieldName, configValue })
      const isShow = configValue === undefined ? defaults[pageType][fn] : configValue;
      await genWithTemplate(
        `tools/templates/page-components/titlebar/${pageType}/${fn}.tsx.mustache`,
        `./gen/entitylib/${modelName}/${pageType}/titlebar/${fn}.tsx`,
        {
          modelNameCapitalized: capitalize(modelName),
          readableName: schemaObj.readableName || makeReadableName(modelName),
          readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
          modelName,
          schemaObj,

          // The flag below is used in mustache templates
          show: isShow ? "true" : "false"
        },
      );
    }
  }

}
//context has:  modelName, schemaObj, definitions, schemaId
async function listTitleBarGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/list-titlebar.tsx.mustache',
    `./gen/entitylib/${modelName}/list/titlebar.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions,
      listPageOptionsJson,
    },
  );
}

//context has:  modelName, schemaObj, definitions, schemaId
async function listComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.listPage) {
    return;
  }
  const listPageOptions = schemaObj.uiHints.listPage;
  const eventCreatePageOptions = schemaObj.uiHints.eventCreatePage;
  const eventCreatePageOptionsJson = JSON.stringify(eventCreatePageOptions, null, 2);

  const listPageOptionsJson = JSON.stringify(listPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/list-component.tsx.mustache',
    `gen/page-components/${modelName}/list.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      listPageOptions,
      eventCreatePageOptionsJson,
      listPageOptionsJson,
    },
  );
}

// create page
async function createPageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.createPage) {
    return;
  }
  const createPageOptions = schemaObj.uiHints.createPage;
  const createPageOptionsJson = JSON.stringify(createPageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/create-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/create/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      createPageOptions,
      createPageOptionsJson,
    },
  );
}

//create titlebar
async function createTitleBarGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.createPage) {
    return;
  }
  const createPageOptions = schemaObj.uiHints.createPage;
  const createPageOptionsJson = JSON.stringify(createPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/create-titlebar.tsx.mustache',
    `./gen/entitylib/${modelName}/create/titlebar.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      createPageOptions,
      createPageOptionsJson,
    },
  );

}
// create page component
async function createComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.createPage) {
    return;
  }
  const createPageOptions = schemaObj.uiHints.createPage;
  const createPageOptionsJson = JSON.stringify(createPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/create-component.tsx.mustache',
    `gen/page-components/${modelName}/create.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      createPageOptions,
      createPageOptionsJson,
    },
  );
}

async function detailPageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.detailPage) {
    return;
  }
  const detailPageOptions = schemaObj.uiHints.detailPage;
  const detailPageOptionsJson = JSON.stringify(detailPageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/detail-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/[id]/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      detailPageOptionsJson,
    },
  );
}
const getPropsJsonForTab = ({ tab, uiSchema, jsonSchema }) => {
  const additionalProps = {}
  if (tab?.props && tab?.props?.includeUISchema) {
    additionalProps.uiSchema = uiSchema
  }
  if (tab?.props && tab?.props?.includeJsonSchema && jsonSchema?.properties) {
    additionalProps.jsonSchema = formatJSONSchemeWithDefinitions(jsonSchema)?.properties
  }
  return JSON.stringify({ ...tab.props, ...additionalProps } || {}, null, 2)
}


//context has:  modelName, schemaObj, definitions, schemaId
async function detailTitleBarGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.detailPage) {
    return;
  }
  const detailPageOptions = schemaObj.uiHints.detailPage;
  const detailPageOptionsJson = JSON.stringify(detailPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/detail-titlebar.tsx.mustache',
    `./gen/entitylib/${modelName}/detail/titlebar.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      detailPageOptionsJson,
    },
  );

}
const formatJSONSchemeWithDefinitions = ({ properties, definitions }) => {
  const formatPropsDeep = (schema) => {
    return Object.entries(schema).reduce((acc, [key, value]) => {
      if (value["$ref"]) {
        const refItem = value["$ref"].split('definitions/')[1];
        const refValue = definitions[refItem];
        acc[key] = {
          ...value,
          type: 'object',
          properties: refValue.properties ? formatPropsDeep(refValue.properties) : undefined
        };
      } else if (value.properties && typeof value.properties === 'object') {
        acc[key] = {
          ...value,
          properties: formatPropsDeep(value.properties)
        };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  };
  return { properties: formatPropsDeep(properties), definitions };
}


//context has:  modelName, schemaObj, definitions, schemaId
async function detailComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.detailPage) {
    return;
  }
  const options = schemaObj.uiHints.detailPage;
  const uiSchema = schemaObj.uiHints.form.uiSchema
  const detailPageOptions = {
    ...options,
    tabs: options.tabs?.map((tab) => ({
      ...tab,
      propsJson: getPropsJsonForTab({ tab, uiSchema, jsonSchema: schemaObj.jsonschema }),
    })),
  };
  const detailPageOptionsJson = JSON.stringify(detailPageOptions, null, 2);
  const hasOverviewTab = detailPageOptions.tabs.find((tab) => tab.type === "overview") ? true : false;
  return genWithTemplate(
    'tools/templates/page-components/detail-component.tsx.mustache',
    `gen/page-components/${modelName}/detail.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      hasOverviewTab,
      detailPageOptionsJson,
    },
  );
}

//context has:  modelName, schemaObj, definitions, schemaId
async function detailImportsGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.detailPage) {
    return;
  }
  // console.log(schemaObj.uiHints?.detailPage.overviewFields)
  const options = schemaObj.uiHints.detailPage;
  const jsonSchema = schemaObj.jsonschema.properties
  const uiSchema = schemaObj.uiHints.form.uiSchema
  const detailPageOptions = {
    ...options,
    tabs: options.tabs?.map((tab) => ({
      ...tab,
      propsJson: getPropsJsonForTab({ tab, uiSchema, jsonSchema }),
    })),
  };

  const dataFunctions = detailPageOptions.tabs
    .filter(tab => tab.getData ? true : false)
    .map((tab) => tab.getData);
  const detailPageOptionsJson = JSON.stringify(detailPageOptions, null, 2);

  await genWithTemplate(
    'tools/templates/page-components/detail-get-data.ts.mustache',
    `gen/entitylib/${modelName}/detail/getData/index.ts`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      detailPageOptionsJson,
    },
  );

  await genWithTemplate(
    'tools/templates/page-components/create-form-context.ts.mustache',
    `gen/entitylib/${modelName}/create/getCreateFormContext.ts`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      detailPageOptionsJson,
    },
  );
  let renderFunctions = [];
  const _overviewFields = detailPageOptions?.overviewFields;
  if (_overviewFields) {
    const overviewFields = _overviewFields.filter((def) =>
      (!/[\.\?\[\]]/.test(def.field)) ? true : false)
    renderFunctions = uniqBy(overviewFields.map((def) =>
      def.renderCell
    ).filter(isDefined), identity);

    await Promise.all(
      overviewFields
        .map(genRenderOverviewField(modelName, schemaId, schemaObj))
    );
  }

  return genWithTemplate(
    'tools/templates/page-components/detail-lib-index.ts.mustache',
    `./gen/entitylib/${modelName}/detail/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      detailPageOptions,
      detailPageOptionsJson,
      renderFunctions,
      valueGetterFunctions: [],
    },
  );
}
async function eventListPageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventListPage) {
    return;
  }
  const eventListPageOptions = schemaObj.uiHints.eventListPage;
  const eventListPageOptionsJson = JSON.stringify(eventListPageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/event-list-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/[id]/event/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventListPageOptions,
      eventListPageOptionsJson,
    },
  );
}

async function eventListComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventListPage) {
    return;
  }
  const eventListPageOptions = schemaObj.uiHints.eventListPage;
  const eventListPageOptionsJson = JSON.stringify(eventListPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/event-list-component.tsx.mustache',
    `gen/page-components/${modelName}/event-list.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventListPageOptions,
      eventListPageOptionsJson,
    },
  );
}

async function eventCreatePageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventCreatePage) {
    return;
  }
  const eventCreatePageOptions = schemaObj.uiHints.eventCreatePage;
  const eventCreatePageOptionsJson = JSON.stringify(eventCreatePageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/event-create-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/[id]/create-event/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventCreatePageOptions,
      eventCreatePageOptionsJson,
    },
  );
}


async function eventEditTitlebarGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventEditPage) {
    return;
  }
  const eventEditPageOptions = schemaObj.uiHints.eventEditPage;
  const eventEditPageOptionsJson = JSON.stringify(eventEditPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/event-edit-titlebar.tsx.mustache',
    `./gen/entitylib/${modelName}/event-edit/titlebar.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventEditPageOptions,
      eventEditPageOptionsJson,
    },
  );
}

async function eventEditComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventEditPage) {
    return;
  }
  const eventEditPageOptions = schemaObj.uiHints.eventEditPage;
  const eventEditPageOptionsJson = JSON.stringify(eventEditPageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/event-edit-component.tsx.mustache',
    `gen/page-components/${modelName}/event-edit.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventEditPageOptions,
      eventEditPageOptionsJson,
    },
  );
}


async function eventEditPageGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventEditPage) {
    return;
  }
  const eventEditPageOptions = schemaObj.uiHints.eventEditPage;
  const eventEditPageOptionsJson = JSON.stringify(eventEditPageOptions, null, 2);
  return genWithTemplateNoOverwrite(
    'tools/templates/pages/event-edit-page.tsx.mustache',
    `pages/private/farmbook/[org]/${modelName}/[id]/event/[eventId]/index.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventEditPageOptions,
      eventEditPageOptionsJson,
    },
  );
}


async function eventCreateTitlebarGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventCreatePage) {
    return;
  }
  const eventCreatePageOptions = schemaObj.uiHints.eventCreatePage;
  const eventCreatePageOptionsJson = JSON.stringify(eventCreatePageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/event-create-titlebar.tsx.mustache',
    `./gen/entitylib/${modelName}/event-create/titlebar.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventCreatePageOptions,
      eventCreatePageOptionsJson,
    },
  );
}

async function eventCreateComponentGen(modelName, schemaObj, definitions, schemaId) {
  if (!schemaObj.uiHints?.eventCreatePage) {
    return;
  }
  const eventCreatePageOptions = schemaObj.uiHints.eventCreatePage;
  const eventCreatePageOptionsJson = JSON.stringify(eventCreatePageOptions, null, 2);
  return genWithTemplate(
    'tools/templates/page-components/event-create-component.tsx.mustache',
    `gen/page-components/${modelName}/event-create.tsx`,
    {
      modelNameCapitalized: capitalize(modelName),
      readableName: schemaObj.readableName || makeReadableName(modelName),
      readableNamePlural: schemaObj.readableNamePlural || makeReadableNamePlural(modelName),
      modelName,
      schemaObj,
      definitions,
      schemaId,
      eventCreatePageOptions,
      eventCreatePageOptionsJson,
    },
  );
}

const apiCreateGen = async (modelName, schemaObj, definitions, schemaId) =>
  genApiWithTemplate({
    modelName,
    schemaObj,
    definitions,
    schemaId,
    operation: 'create',
  });

const apiGetGen = async (modelName, schemaObj, definitions, schemaId) =>
  genApiWithTemplate({
    modelName,
    schemaObj,
    definitions,
    schemaId,
    operation: 'get',
  });

const apiListGen = async (modelName, schemaObj, definitions, schemaId) =>
  genApiWithTemplate({
    modelName,
    schemaObj,
    definitions,
    schemaId,
    operation: 'list',
  });

const apiUpdateGen = async (modelName, schemaObj, definitions, schemaId) =>
  genApiWithTemplate({
    modelName,
    schemaObj,
    definitions,
    schemaId,
    operation: 'update',
  });

const apiDeleteGen = async (modelName, schemaObj, definitions, schemaId) =>
  genApiWithTemplate({
    modelName,
    schemaObj,
    definitions,
    schemaId,
    operation: 'delete',
  });

const apiModelRootGen = async (modelName, schemaObj, definitions, schemaId) => {
  if (!apiWhiteList.includes(modelName)) {
    return;
  }

  genWithTemplate(
    `tools/templates/api/model-root.ts.mustache`,
    `${apiGenRoot}/${modelName}/model-index.ts`,
    { modelName, schemaObj, definitions, schemaId },
  );
};
const apiModelInstanceRootGen = async (modelName, schemaObj, definitions, schemaId) => {
  if (!apiWhiteList.includes(modelName)) {
    return;
  }
  genWithTemplate(
    `tools/templates/api/instance-root.ts.mustache`,
    `${apiGenRoot}/${modelName}/instance-index.ts`,
    { modelName, schemaObj, definitions, schemaId },
  );
};

const apiModelIndexGen = async (modelName, schemaObj, definitions, schemaId) =>
  genWithTemplate(
    `tools/templates/api/model-index.ts.mustache`,
    `${apiGenRoot2}/${modelName}/index.ts`,
    { modelName, schemaObj, definitions, schemaId },
  );

const apiModelInstanceIndexGen = async (modelName, schemaObj, definitions, schemaId) =>
  genWithTemplate(
    `tools/templates/api/instance-index.ts.mustache`,
    `${apiGenRoot2}/${modelName}/[id]/index.ts`,
    { modelName, schemaObj, definitions, schemaId },
  );

const workflowGen = async (modelName, schemaObj, definitions, schemaId) => {
  if (!schemaObj.lifecycle) {
    return;
  }
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const defaultLifeCycle = {
    inputValidator: '../../../workflows/farmbook/functions/schemaValidator',
    createSteps: [
      '../../../workflows/farmbook/functions/createCropEvent',
      '~/workflows/common/functions/validation/updateWorkflowId',
    ],
    updateSteps: ['../../../workflows/farmbook/functions/updateCropEvent'],
    deleteSteps: ['../../../workflows/farmbook/functions/deleteCropEvent'],
    validationWorkflow: true,
    userSubmitSteps: [
      '~/workflows/common/functions/validation/setUnderReviewStatus',
      '~/workflows/common/functions/validation/sendNotificationForReview',
    ],
    reviewPassSteps: ['~/workflows/common/functions/validation/validationPass'],
    reviewFailSteps: [
      '~/workflows/common/functions/validation/reviewFail',
      '~/workflows/common/functions/validation/sendNotificationForRejection',
    ],
    validatePassSteps: ['~/workflows/common/functions/validation/validationPass'],
    validateFailSteps: [
      '~/workflows/common/functions/validation/validationFail',
      '~/workflows/common/functions/validation/sendNotificationForRejection',
    ],
    createVersionSteps: ['~/workflows/common/functions/validation/bumpVersion'],
  };
  const _lifecycleDef = schemaObj?.lifecycle || defaultLifeCycle;
  const lifecycleDef = normalizeLifecycleSteps(_lifecycleDef);
  const ctx = {
    lifecycle: lifecycleDef,
    appName,
    modelName,
    title: schemaObj.jsonschema.title || schemaObj.jsonschema.description || modelName,
    description: schemaObj.jsonschema.description || schemaObj.jsonschema.title || modelName,
    schemaObj,
    definitions,
    schemaId,
  };
  return genWithTemplate(
    `tools/templates/workflows/lifecycle.yaml.mustache`,
    `gen/workflows/src/${modelName}LifeCycle.yaml`,
    ctx,
  );
};

const normalizeLifecycleSteps = (lcDef) => ({
  ...lcDef,
  createSteps: normalizeSteps(lcDef.createSteps),
  updateSteps: normalizeSteps(lcDef.updateSteps),
  deleteSteps: normalizeSteps(lcDef.deleteSteps),
  migrateSteps: normalizeSteps(lcDef.migrateSteps),
  userSubmitSteps: normalizeSteps(lcDef.userSubmitSteps),
  reviewPassSteps: normalizeSteps(lcDef.reviewPassSteps),
  reviewFailSteps: normalizeSteps(lcDef.reviewFailSteps),
  validatePassSteps: normalizeSteps(lcDef.validatePassSteps),
  validateFailSteps: normalizeSteps(lcDef.validateFailSteps),
  createVersionSteps: normalizeSteps(lcDef.createVersionSteps),
});

// From import path derive name and description - as expected by mustache template
const normalizeSteps = (steps) =>
  (steps || []).map((step) => ({
    name: nameFromPath(step),
    description: descFromPath(step),
    importPath: step,
  }));

const split = (path) => path.split('/');
const nameFromPath = flow(split, last);
const descFromPath = flow(split, last, startCase);

async function genTemplatedViews(modelDefs) {
  const functionTable = modelDefs
    .filter(isDefined)
    .filter(
      ({ schemaObj }) => schemaObj.templates && Object.entries(schemaObj.templates).length > 0,
    )
    .map(({ modelName, schemaObj }) => {
      const htmlTemplateFunctions = Object.entries(schemaObj.templates).map(
        ([key, mustacheTemplate]) => ({ key, mustacheTemplate: mustacheTemplate.trim() }),
      );
      return { modelName, htmlTemplateFunctions };
    });

  const templateFn = `tools/templates/html/templated-views.ts.mustache`;
  const outputfn = `./gen/templated-views.ts`;
  const ctx = { functionTable };
  return genWithTemplate(templateFn, outputfn, ctx);
}

async function genModelTable(modelDefs) {
  const templateFn = `tools/templates/api/modelTable.ts.mustache`;
  const outputfn = `./gen/modelTable.ts`;
  const schemaList = modelDefs
    .filter(isDefined)
    .filter(({ modelName }) => modelName !== 'definitions')
    .map(({ modelName, schemaObj }) => ({
      modelName,
      jsonschema: JSON.stringify(schemaObj.jsonschema),
    }));
  const ctx = { schemaList: uniqBy(schemaList, 'modelName') };
  return genWithTemplate(templateFn, outputfn, ctx);
}

async function genSchemaDirectory(modelDefs) {
  const templateFn = `tools/templates/schema-directory.ts.mustache`;
  const outputfn = `./gen/schema-directory.ts`;
  const schemaList = modelDefs
    .filter(isDefined)
    .filter(({ modelName }) => modelName !== 'definitions')
    .map(({ modelName, schemaObj }) => ({
      modelName,
      jsonschema: JSON.stringify(schemaObj.jsonschema),
    }));
  const ctx = { schemaList: uniqBy(schemaList, 'modelName') };
  return genWithTemplate(templateFn, outputfn, ctx);
}

function isDefined(x) {
  return x !== undefined;
}

const makeReadableName = (modelName) => capitalize(modelName);
const makeReadableNamePlural = (modelName) => `${makeReadableName(modelName)}s`;

function getFieldType(field, jsonSchema) {
  const fieldPath = field.split('.');
  const fieldSchema = fieldPath.reduce((acc, key) => {
    // console.log({ acc, key, props: acc?.properties, found: acc?.properties?.[key] })
    if (acc?.properties?.[key]?.$ref) {
      const refItem = acc?.properties?.[key]?.$ref.split('definitions/')[1];
      return jsonSchema?.definitions?.[refItem];
    }
    return acc?.properties?.[key];
  }, jsonSchema);
  // console.log({ field, fieldSchema: fieldSchema?.type || fieldSchema })
  return fieldSchema?.type || fieldSchema;
}
/*
//eg
schema = {
  type: "object",
  properties: {
    user: {
      $ref: "#/definitions/person"
    }
  },
  definitions: {
    person: {
      type: "object",
      properties: {
        name: { type: "string" },
        address: {
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zip: { type: "string" },
          },
        }
      }
    }

  }
}
getFieldType("user.person.address.city", schema)
*/