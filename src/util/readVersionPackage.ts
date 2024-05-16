import { parseJSON } from '@/util/parseJSON';
import { readFile } from '@/util/readFile';

export async function readPackageVersion(filePath: string): Promise<string> {
  try {
    const data = await readFile(filePath);
    const packageJson = parseJSON(data);
    const devDependencies = packageJson?.devDependencies?.['s-update-manager'];
    const dependencies = packageJson?.dependencies?.['s-update-manager'];
    const version = packageJson?.version;
    return String(devDependencies || dependencies || version || 'last');
  } catch (err) {
    return '';
  }
}
