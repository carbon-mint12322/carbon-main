import { SHA3 } from 'sha3';


export function serializePayload(lockedPayloadData: any) {
  const jsonPayload = JSON.stringify(lockedPayloadData);
  const payload = Buffer.from(jsonPayload).toString('base64');
  return payload;
}

export function calcHash(str: string): string {
  const hash = new SHA3(512);
  hash.update(str);
  return hash.digest('hex');
}

export function deserialize(base64Str: string) {
  const jsonStr = Buffer.from(base64Str, 'base64').toString();
  const payload = JSON.parse(jsonStr);
  const hash = calcHash(base64Str);
  return { header: { hash }, payload };
}

