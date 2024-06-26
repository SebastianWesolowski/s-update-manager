export function isEmptyObject(obj: object | undefined): boolean {
  if (obj === undefined) {
    return true;
  }
  return Object.keys(obj).length === 0;
}
