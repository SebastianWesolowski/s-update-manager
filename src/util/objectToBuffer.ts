export function objectToBuffer(obj: object): Buffer {
  const jsonString = JSON.stringify(obj);
  return Buffer.from(jsonString, 'utf-8');
}
