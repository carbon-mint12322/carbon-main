# Workflow definitions
 
- Workflow definitions must conform to JSON schema [here:](backendlib/workflow2/workflow-def-schema.yaml)

- The workflow codegen generates the following files:
 
  - `gen/workflows/agent-signup-example/api-handler.ts`
  - `gen/workflows/agent-signup-example/<event>-schema.json` - a JSON 
    schema file for each event input
  - `gen/workflows/agent-signup-example/<event>-form.rtml.yaml` -
    one form for each input event
 
- Sample workflow definition in
  [here](./specs/workflows/src/agent-signup-example.yaml)
