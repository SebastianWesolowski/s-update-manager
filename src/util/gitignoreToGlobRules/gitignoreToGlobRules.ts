import path from 'path';
import { createPath } from '../createPath';
import { readFile } from '@/util/readFile';
export async function gitignoreToGlobRules({
  prefix,
  gitignorePath,
}: {
  prefix: string;
  gitignorePath: string;
}): Promise<string[]> {
  try {
    const content = await readFile(gitignorePath).then((data) => data.toString());

    const rules = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const globPatterns = rules.map((rule) => {
      if (rule.startsWith('!')) {
        rule = `!./${path.join(prefix, rule.slice(1))}`;
      } else {
        rule = `./${createPath([path.join(prefix, rule)])}`;
      }
      return rule.replace(/\/\//g, '/');
    });

    return globPatterns;
  } catch (error) {
    console.error('Error processing .gitignore file:', error);
    return [];
  }
}
