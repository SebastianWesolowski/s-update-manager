export function parseJSON(data: string, isDebug = false): any {
  try {
    if (data === '') {
      return {};
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    if (isDebug) {
      console.error(new Error().stack);
    }
    return {};
  }
}
