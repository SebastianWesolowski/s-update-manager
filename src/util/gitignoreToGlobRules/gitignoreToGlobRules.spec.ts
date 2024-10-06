import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { gitignoreToGlobRules } from './gitignoreToGlobRules';

describe('gitignoreToGlobRules', () => {
  let tempDir;
  let gitignorePath;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
    gitignorePath = path.join(tempDir, '.gitignore');
  });

  afterEach(async () => {
    await fs.rmdir(tempDir, { recursive: true });
  });

  const writeGitignore = async (content) => {
    await fs.writeFile(gitignorePath, content);
  };

  it('empty .gitignore returns an empty array', async () => {
    await writeGitignore('');
    const result = await gitignoreToGlobRules({ prefix: '/prefix', gitignorePath });
    expect(result).toEqual([]);
  });

  it('ignores comments and empty lines', async () => {
    await writeGitignore(`
      # This is a comment

      *.log
      # Another comment
      temp/
    `);
    const result = await gitignoreToGlobRules({ prefix: '/prefix', gitignorePath });
    expect(result).toEqual(['./prefix/*.log', './prefix/temp/']);
  });

  it('adds prefix to all rules', async () => {
    await writeGitignore(`
      file.txt
      dir/
      *.log
    `);
    const result = await gitignoreToGlobRules({ prefix: '/project', gitignorePath });
    expect(result).toEqual(['./project/file.txt', './project/dir/', './project/*.log']);
  });

  it('handles negation', async () => {
    await writeGitignore(`
      *.log
      !important.log
    `);
    const result = await gitignoreToGlobRules({ prefix: '/app', gitignorePath });
    expect(result).toEqual(['./app/*.log', '!./app/important.log']);
  });

  it('handles patterns with asterisks', async () => {
    await writeGitignore(`
      *.txt
      **/temp
      logs/**/debug.log
    `);
    const result = await gitignoreToGlobRules({ prefix: '/root', gitignorePath });
    expect(result).toEqual(['./root/*.txt', './root/**/temp', './root/logs/**/debug.log']);
  });

  it('handles patterns with double asterisks', async () => {
    await writeGitignore(`
      **/node_modules/**
      **/.vscode
    `);
    const result = await gitignoreToGlobRules({ prefix: '/project', gitignorePath });
    expect(result).toEqual(['./project/**/node_modules/**', './project/**/.vscode']);
  });

  it('handles special characters', async () => {
    await writeGitignore(`
      **/*.min.js
      **/[a-z]*.txt
      file?.log
    `);
    const result = await gitignoreToGlobRules({ prefix: '/src', gitignorePath });
    expect(result).toEqual(['./src/**/*.min.js', './src/**/[a-z]*.txt', './src/file?.log']);
  });

  it('handles absolute paths', async () => {
    await writeGitignore(`
      /root.txt
      /dir/file.js
    `);
    const result = await gitignoreToGlobRules({ prefix: '/project', gitignorePath });
    expect(result).toEqual(['./project/root.txt', './project/dir/file.js']);
  });

  it('handles a combination of different patterns', async () => {
    await writeGitignore(`
      # Ignore log files
      *.log
      !important.log

      # Ignore node_modules directories
      **/node_modules/**

      # Ignore configuration files
      .env
      config/*.json

      # Ignore temporary files
      **/*.tmp
      temp/

      # But don't ignore certain files
      !temp/keep.txt
    `);
    const result = await gitignoreToGlobRules({ prefix: '/myapp', gitignorePath });
    expect(result).toEqual([
      './myapp/*.log',
      '!./myapp/important.log',
      './myapp/**/node_modules/**',
      './myapp/.env',
      './myapp/config/*.json',
      './myapp/**/*.tmp',
      './myapp/temp/',
      '!./myapp/temp/keep.txt',
    ]);
  });
});
