export function toCamelCase(input, prefix) {
  if (input)
    return `${input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}${prefix}`;
}
