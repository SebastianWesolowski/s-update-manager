import fs from 'fs';

export async function readFile(filePath: string, isDebug = false): Promise<string> {
  if (!fs.existsSync(filePath)) {
    const errorMessage = `File ${filePath} does not exist.`;
    if (isDebug) {
      console.error(errorMessage);
      console.error(new Error().stack); // Display call stack for debugging
    }
    return ''; // Return empty content when file does not exist
  }

  try {
    return await fs.promises.readFile(filePath, 'utf8');
  } catch (err) {
    if (isDebug) {
      console.error(`Error while reading file ${filePath}`, err);
      console.error(new Error().stack); // Display call stack for debugging
    }
    throw err; // Pass the error further to be handled by the calling function
  }
}
