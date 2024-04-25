const { flatten, uniqBy, once, uniq, values } = require('lodash');
const { preadFile } = require('./fsutil');
const { listFiles } = require('./lib');
const { genWithTemplate } = require('./genutil');
const { yamlWithInclude } = require('./yaml-include');

const mapStepImports = (trigger) =>
  (trigger.processingSteps || []).map((step) => ({ name: step.name, path: step.importPath }));

const mapCondImports = (trigger) =>
  (trigger.transitions || [])
    .map((tr) => (tr.condition ? { name: tr.condition.name, path: tr.condition.importPath } : null))
    .filter((importdef) => (importdef !== null ? true : false));

const makeImportBlock = (wfdef) => {
  const importDefs = wfdef.states.map((stateDef) =>
    (stateDef.triggers || []).map((trigger) => {
      const stepImports = mapStepImports(trigger);
      const condImports = flatten(mapCondImports(trigger));
      return [...stepImports, ...condImports];
    }),
  );
  return flatten(flatten(importDefs));
};

// Create a context for code generation The fields inside the context
// are available for templates
const makeGenCtx = (wfdef) => {
  const getName = (x) => x.name;
  const imports = uniqBy(makeImportBlock(wfdef), getName);
  const mermaid = makeMermaid(wfdef);

  return {
    wfdef,
    startSchemaName: getStartSchemaName(wfdef),
    inputSchemas: getInputSchemaNames(wfdef),
    imports,
    mermaid,
    json: JSON.stringify(wfdef),
  };
};

function getStartSchemaName(wfdef) {
  const startState = wfdef.states.find((st) => st.name == 'start');
  const trigger = startState.triggers[0];
  return trigger.inputSchemaName || trigger.eventName;
}

function getStartEventName(wfdef) {
  const startState = wfdef.states.find((st) => st.name == 'start');
  const trigger = startState.triggers[0];
  return trigger.eventName;
}

function getWfStartEventDescription(wfdef) {
  const startState = wfdef.states.find((st) => st.name == 'start');
  const trigger = startState.triggers[0];
  return trigger.description;
}

// getInputSchemaNames :: WorkflowDefinition -> String[]
function getInputSchemaNames(wfdef) {
  const schemaNames = wfdef.states.flatMap((stateDef) =>
    (stateDef.triggers || [])
      // Ignore schemas that define "inputSchema" in-place
      // because we only generate UIs for the ones defined externally
      .filter((t) => (t.inputSchemaName ? true : false))
      .map((trigger) => {
        return trigger.inputSchemaName;
      }),
  );
  return schemaNames;
}

// getInputSchemaNames :: WorkflowDefinition -> String[]
function getEventName2SchemaMapping(workflows) {
  const maps = workflows.flatMap((wfdef) =>
    wfdef.states.flatMap((stateDef) =>
      (stateDef.triggers || [])
        // Ignore schemas that define "inputSchema" in-place
        // because we only generate UIs for the ones defined externally
        .filter((t) => (t.inputSchemaName ? true : false))
        .map((trigger) => {
          return { eventName: trigger.eventName, schemaName: trigger.inputSchemaName };
        }),
    ),
  );

  const compareEventName = ({ eventName }) => eventName;
  return uniqBy(maps, compareEventName);
}

const mapSchemaFiles = async (parsed) => {
  const statesInput = parsed.states.states || parsed.states;
  const proms =
    typeof statesInput === 'object' ? values(statesInput).map(mapState) : statesInput.map(mapState);
  const states = await Promise.all(proms);
  return { ...parsed, states };
};

const makeMermaid = (wfdef) => {
  const states = wfdef.states;

  const texts = states
    .filter((state) => state.triggers)
    .map((state) => {
      const targets = state.triggers
        .filter((trigger) => trigger.transitions)
        .map((trigger) => {
          const { eventName, transitions } = trigger;
          const arrows = transitions.map((transition) => {
            const fromStateName = state.name;
            const { state: toStateName } = transition;
            return `${fromStateName} -->|${eventName}| ${toStateName}`;
          });
          return arrows.join('\n');
        });
      return targets.join('\n');
    });

  return texts.join('\n');
};

// Main codegen
const codegenWf = async (srcFile) => {
  const content = await preadFile(srcFile);
  const parsed = await yamlWithInclude(srcFile)(content);
  //replace inputSchemaFile's with inputSchema's
  const def = await mapSchemaFiles(parsed);
  // console.log("WF DEF: ", def)
  // TODO - validate here
  const genCtx = makeGenCtx(def);
  const genTargets = [
    {
      template: 'tools/templates/workflows/api-handler.ts.mustache',
      outfn: `gen/workflows/${def.name}/api-handler.ts`,
    },
    {
      template: 'tools/templates/workflows/workflow-def.js.mustache',
      outfn: `gen/workflows/${def.name}/wf-schema.js`,
    },
  ];

  const proms1 = genTargets.map(({ template, outfn }) => {
    //console.log(`[WF] ${outfn}`);
    return genWithTemplate(template, outfn, genCtx);
  });
  const proms2 = def.states.map((state) => {
    const proms = (state.triggers || []).map((trigger) => {
      const schema = trigger.inputSchema;
      const jsonCtx = { ...genCtx, json: JSON.stringify(schema) };
      const formCtx = {
        modelName:
          trigger.inputSchemaName ||
          trigger.eventName ||
          variableify(def.name, state.name, trigger.eventName),
        jsonSchema: JSON.stringify(schema),
      };
      const targets = [
        // {
        //   template: 'tools/templates/workflows/workflow-def.js.mustache',
        //   outfn: `gen/workflows/${def.name}/${trigger.eventName}-schema.js`,
        //   ctx: jsonCtx,
        // },
        // {
        //   template: 'tools/templates/forms/form.jsx.mustache',
        //   outfn: `gen/workflows/${def.name}/${trigger.eventName}-form.rtml.jsx`,
        //   ctx: formCtx,
        // },
      ];
      // overwrite json

      return targets.map(({ template, outfn, ctx }) => {
        return genWithTemplate(template, outfn, ctx);
      });
    });
    return flatten(proms);
  });
  await Promise.all([...proms1, ...proms2]);

  return def;
};

/**
 * Generate an index of workflow definitions for runtime lookup.
 */

const generateIndex = async (workflows) => {
  const inputSchemaNames = workflows.flatMap(getInputSchemaNames);
  const uniqInputSchemaNames = uniq(inputSchemaNames);
  const event2schemaMaps = getEventName2SchemaMapping(workflows);
  // Index of Mapped (functions), plain definitions of workflows for use by UI
  await genWithTemplate(
    //NoOverwrite
    'tools/templates/workflows/index.ts.mustache',
    `gen/workflows/index.ts`,
    {
      uniqInputSchemaNames,
      event2schemaMaps,
      workflows: workflows.map((wfdef) => {
        const inputSchemas = uniq(getInputSchemaNames(wfdef));
        const ctx = {
          name: wfdef.name,
          inputSchemas,
          mappedName: variableifyWfName(wfdef.name),
          startSchemaName: getStartSchemaName(wfdef),
          startEventName: getStartEventName(wfdef),
          startEventDescription: getWfStartEventDescription(wfdef),
        };
        return ctx;
      }),
    },
  );

  // Index of Unmapped, plain definitions of workflows for use by UI
  await genWithTemplate(
    //NoOverwrite
    'tools/templates/workflows/index-fe.tsx.mustache',
    `gen/workflows/index-fe.tsx`,
    {
      uniqInputSchemaNames,
      event2schemaMaps,
      workflows: workflows.map((wfdef) => {
        const inputSchemas = uniq(getInputSchemaNames(wfdef));
        const ctx = {
          name: wfdef.name,
          inputSchemas,
          mappedName: variableifyWfName(wfdef.name),
          startSchemaName: getStartSchemaName(wfdef),
          startEventName: getStartEventName(wfdef),
          startEventDescription: getWfStartEventDescription(wfdef),
        };
        // console.log(ctx);
        return ctx;
      }),
    },
  );
};
// eslint-disable-next-line
const wfWildcard = '{gen,specs}/workflows/src/**/*.yaml';
const main = (glob = wfWildcard) =>
  listFiles('.', glob)
    //.then(dbgTap("list of files"))
    .then((sources) => Promise.all(sources.map(codegenWf)).then(generateIndex));

const capitalize = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
const trim = (s) => s.trim();
// eslint-disable-next-line

const specials = /[^a-zA-Z0-9_]/;
// Create a JS variable name given three components
const variableify = (wfName, stateName, triggerName) =>
  wfName.split(specials).concat([stateName, triggerName]).map(trim).map(capitalize).join('_');

// Create a JS variable name given three components
const variableifyWfName = (wfName) => wfName.split(specials).map(trim).map(capitalize).join('_');
module.exports = {
  main,
  codegenWf,
  variableify,
};

// Local utility functions

// Load inputSchemaFile and replace with inputSchema
const loadInputSchema = async (fn) => {
  // Map shortcut "~" to "."
  const fileNameWithFixedPath = fn.replace(/^~/, '.');
  const content = await preadFile(fileNameWithFixedPath);
  return JSON.parse(content);
};

const defsPath = 'gen/jsonschemas/definitions.json';
const _loadDefinitions = async () => {
  const content = await preadFile(defsPath);
  return JSON.parse(content);
};

const loadDefinitions = once(_loadDefinitions);

// Map trigger with `inputSchemaFile` to `inputSchema` by reading
// input json files and parsing them.
const mapTrigger = async (trigger) => {
  if (trigger.inputSchema) {
    return trigger;
  }
  const { inputSchemaFile, ...rest } = trigger;
  const fn =
    inputSchemaFile || `gen/jsonschemas/${trigger.inputSchemaName || trigger.eventName}.json`;
  const definitions = await loadDefinitions();
  const _inputSchema = await loadInputSchema(fn);
  const inputSchema = { definitions, ..._inputSchema };
  const mapped = {
    ...rest,
    inputSchemaName: trigger.inputSchemaName || trigger.eventName,
    inputSchema,
  };
  // console.log('mapped trigger', JSON.stringify(mapped.inputSchema, null, 2));
  return mapped;
};

// Map state with `inputSchemaFile` to `inputSchema`
// by reading input json files and parsing them.
const mapState = async (state) => {
  if (!state.triggers) {
    return state;
  }
  const triggers = await Promise.all(state.triggers.map(mapTrigger));
  return { ...state, triggers };
};
