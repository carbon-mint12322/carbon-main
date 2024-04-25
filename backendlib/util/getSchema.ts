export function getSchema(schemaName: string) {
  return require(`~/gen/jsonschemas/${schemaName}.json`);
}
