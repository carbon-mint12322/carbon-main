export function isUrl(val: unknown) {
  return typeof val === 'string' && val.startsWith('http');
}
